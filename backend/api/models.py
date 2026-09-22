from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    CATEGORY_CHOICES = [
        ('Arrays', 'Arrays'),
        ('Strings', 'Strings'),
        ('Hash Maps', 'Hash Maps'),
        ('Linked Lists', 'Linked Lists'),
        ('Stacks', 'Stacks'),
        ('Queues', 'Queues'),
        ('Trees', 'Trees'),
        ('Graphs', 'Graphs'),
        ('Recursion', 'Recursion'),
        ('Sorting', 'Sorting'),
        ('Searching', 'Searching'),
        ('Dynamic Programming', 'Dynamic Programming'),
        ('Greedy Algorithms', 'Greedy Algorithms'),
    ]

    problem_number = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='Easy')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Arrays')
    description = models.TextField()
    examples = models.JSONField(default=list)  # list of {input, output, explanation}
    constraints = models.JSONField(default=list) # list of strings
    starter_code = models.JSONField(default=dict) # {python, javascript, java, cpp}
    test_cases = models.JSONField(default=list) # sample test cases
    hidden_test_cases = models.JSONField(default=list) # hidden test cases
    hints = models.JSONField(default=list) # progressive hints list
    solution_explanation = models.TextField(blank=True, default='')
    time_complexity = models.CharField(max_length=100, blank=True, default='O(N)')
    space_complexity = models.CharField(max_length=100, blank=True, default='O(1)')
    is_ai_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['problem_number']

    def __str__(self):
        return f"{self.problem_number}. {self.title}"


class Submission(models.Model):
    STATUS_CHOICES = [
        ('Accepted', 'Accepted'),
        ('Wrong Answer', 'Wrong Answer'),
        ('Runtime Error', 'Runtime Error'),
        ('Compilation Error', 'Compilation Error'),
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
        ('Memory Limit Exceeded', 'Memory Limit Exceeded'),
    ]

    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('java', 'Java'),
        ('cpp', 'C++'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='submissions')
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='python')
    code = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Wrong Answer')
    execution_time = models.FloatField(default=0.0) # in ms
    memory = models.FloatField(default=0.0) # in KB
    test_cases_passed = models.IntegerField(default=0)
    total_test_cases = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.problem.title} ({self.status})"


class UserProgress(models.Model):
    STATUS_CHOICES = [
        ('Solved', 'Solved'),
        ('Attempted', 'Attempted'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='user_progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Attempted')
    attempts_count = models.IntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'problem')

    def __str__(self):
        return f"{self.user.username} - {self.problem.title}: {self.status}"


class Badge(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='award') # Lucide icon name
    category = models.CharField(max_length=50, default='General')

    def __str__(self):
        return self.title


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    daily_challenge_completed = models.BooleanField(default=False)
    unlocked_badges = models.ManyToManyField(Badge, blank=True, related_name='users')

    def __str__(self):
        return f"{self.user.username} (Lvl {self.level}, XP: {self.xp}, Streak: {self.streak})"
