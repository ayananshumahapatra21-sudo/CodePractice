import math
from datetime import date, timedelta
from api.models import UserProfile, Badge, UserProgress, Submission

class GamificationEngine:
    """
    Gamification Engine managing XP calculations, levels, daily streaks,
    and unlocking achievement badges.
    """

    XP_MAP = {
        'Easy': 50,
        'Medium': 100,
        'Hard': 200,
    }

    @classmethod
    def get_or_create_profile(cls, user):
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return profile

    @classmethod
    def update_submission_rewards(cls, user, problem, is_accepted, is_first_solve):
        if not user or not user.is_authenticated:
            return None

        profile = cls.get_or_create_profile(user)
        xp_earned = 0

        if is_accepted and is_first_solve:
            xp_earned = cls.XP_MAP.get(problem.difficulty, 50)
            profile.xp += xp_earned
            # Level formula: Level = floor(sqrt(XP / 50)) + 1
            profile.level = math.floor(math.sqrt(profile.xp / 50)) + 1

        cls.update_streak(profile)
        cls.evaluate_badges(user, profile)
        profile.save()

        return {
            'xp_earned': xp_earned,
            'total_xp': profile.xp,
            'level': profile.level,
            'streak': profile.streak
        }

    @classmethod
    def update_streak(cls, profile):
        today = date.today()
        if profile.last_active_date == today:
            return

        if profile.last_active_date == today - timedelta(days=1):
            profile.streak += 1
        elif profile.last_active_date and profile.last_active_date < today - timedelta(days=1):
            profile.streak = 1
        else:
            profile.streak = 1

        profile.last_active_date = today

    @classmethod
    def evaluate_badges(cls, user, profile):
        # Create standard badges if they don't exist
        cls._ensure_default_badges()

        solved_count = UserProgress.objects.filter(user=user, status='Solved').count()
        accepted_submissions = Submission.objects.filter(user=user, status='Accepted').count()

        badges_to_unlock = []

        # 1. First Solved Problem
        if solved_count >= 1:
            badges_to_unlock.append('first_solve')
        # 2. 5 Solved Problems
        if solved_count >= 5:
            badges_to_unlock.append('solver_5')
        # 3. 10 Solved Problems
        if solved_count >= 10:
            badges_to_unlock.append('solver_10')
        # 4. Streak Badges
        if profile.streak >= 3:
            badges_to_unlock.append('streak_3')
        if profile.streak >= 7:
            badges_to_unlock.append('streak_7')

        for code in badges_to_unlock:
            try:
                badge = Badge.objects.get(code=code)
                if not profile.unlocked_badges.filter(id=badge.id).exists():
                    profile.unlocked_badges.add(badge)
            except Badge.DoesNotExist:
                pass

    @classmethod
    def _ensure_default_badges(cls):
        defaults = [
            ('first_solve', 'First Step', 'Solved your first coding challenge!', 'award', 'Milestones'),
            ('solver_5', 'Problem Solver', 'Successfully solved 5 coding problems!', 'zap', 'Milestones'),
            ('solver_10', 'Code Warrior', 'Conquered 10 coding challenges!', 'trophy', 'Milestones'),
            ('streak_3', 'On Fire', 'Maintained a 3-day coding streak!', 'flame', 'Streaks'),
            ('streak_7', 'Unstoppable', 'Maintained a 7-day coding streak!', 'sparkles', 'Streaks'),
        ]
        for code, title, desc, icon, cat in defaults:
            Badge.objects.get_or_create(
                code=code,
                defaults={'title': title, 'description': desc, 'icon': icon, 'category': cat}
            )
