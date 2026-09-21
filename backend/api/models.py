from django.db import models
from django.contrib.auth.models import User

class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    CATEGORY_CHOICES = [
        ('Array', 'Array'),
        ('String', 'String'),
        ('Linked List', 'Linked List'),
        ('Stack', 'Stack'),
        ('Queue', 'Queue'),
        ('Tree', 'Tree'),
        ('Graph', 'Graph'),
        ('Dynamic Programming', 'Dynamic Programming'),
    ]

    problem_number = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='Easy')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Array')
    description = models.TextField()
    examples = models.JSONField(default=list)  # list of {input, output, explanation}
    constraints = models.JSONField(default=list) # list of strings
    starter_code = models.JSONField(default=dict) # {python, javascript, java, cpp}
    test_cases = models.JSONField(default=list) # sample test cases
    hidden_test_cases = models.JSONField(default=list) # hidden test cases
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
