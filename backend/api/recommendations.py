from api.models import Problem, UserProgress, Submission
from django.db.models import Count, Q

class RecommendationEngine:
    """
    Analyzes user submission metrics and topic proficiency to generate personalized
    coding problem recommendations.
    """

    @classmethod
    def get_recommendations(cls, user):
        if not user or not user.is_authenticated:
            # Fallback recommendations for non-authenticated / guest users
            easy_problems = Problem.objects.filter(difficulty='Easy')[:3]
            return [
                {
                    'problem_id': p.id,
                    'title': p.title,
                    'slug': p.slug,
                    'difficulty': p.difficulty,
                    'category': p.category,
                    'reason': 'Great starter problem for building foundational coding skills!'
                }
                for p in easy_problems
            ]

        # 1. Fetch solved problem IDs for user
        solved_ids = UserProgress.objects.filter(user=user, status='Solved').values_list('problem_id', flat=True)
        attempted_ids = UserProgress.objects.filter(user=user, status='Attempted').values_list('problem_id', flat=True)

        # 2. Analyze weak topics based on failed submissions
        failed_topic_counts = Submission.objects.filter(
            user=user,
            status__in=['Wrong Answer', 'Runtime Error', 'Time Limit Exceeded']
        ).values('problem__category').annotate(fail_count=Count('id')).order_by('-fail_count')

        weak_category = failed_topic_counts[0]['problem__category'] if failed_topic_counts.exists() else None

        recommendations = []

        # Rule A: Unfinished attempted problem (Retry)
        if attempted_ids.exists():
            attempted_problem = Problem.objects.exclude(id__in=solved_ids).filter(id__in=attempted_ids).first()
            if attempted_problem:
                recommendations.append({
                    'problem_id': attempted_problem.id,
                    'title': attempted_problem.title,
                    'slug': attempted_problem.slug,
                    'difficulty': attempted_problem.difficulty,
                    'category': attempted_problem.category,
                    'reason': f'You previously attempted this. Give it another try to earn XP!'
                })

        # Rule B: Focus on weak topic
        if weak_category:
            weak_prob = Problem.objects.exclude(id__in=solved_ids).filter(category=weak_category).first()
            if weak_prob and weak_prob.id not in [r['problem_id'] for r in recommendations]:
                recommendations.append({
                    'problem_id': weak_prob.id,
                    'title': weak_prob.title,
                    'slug': weak_prob.slug,
                    'difficulty': weak_prob.difficulty,
                    'category': weak_prob.category,
                    'reason': f'Recommended based on your practice history in {weak_category}.'
                })

        # Rule C: Gradual Difficulty Escalation
        solved_count = len(solved_ids)
        target_difficulty = 'Easy' if solved_count < 5 else ('Medium' if solved_count < 15 else 'Hard')
        
        esc_problem = Problem.objects.exclude(id__in=solved_ids).filter(difficulty=target_difficulty).first()
        if esc_problem and esc_problem.id not in [r['problem_id'] for r in recommendations]:
            recommendations.append({
                'problem_id': esc_problem.id,
                'title': esc_problem.title,
                'slug': esc_problem.slug,
                'difficulty': esc_problem.difficulty,
                'category': esc_problem.category,
                'reason': f'Match for your current skill level ({target_difficulty}).'
            })

        # Fill up to 3 recommendations with un-solved problems
        if len(recommendations) < 3:
            remaining = Problem.objects.exclude(id__in=solved_ids).exclude(id__in=[r['problem_id'] for r in recommendations])[:3 - len(recommendations)]
            for p in remaining:
                recommendations.append({
                    'problem_id': p.id,
                    'title': p.title,
                    'slug': p.slug,
                    'difficulty': p.difficulty,
                    'category': p.category,
                    'reason': f'Expand your knowledge across {p.category}.'
                })

        return recommendations
