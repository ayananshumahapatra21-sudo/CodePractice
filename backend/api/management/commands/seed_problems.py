from django.core.management.base import BaseCommand
from api.models import Problem
from api.seed_data import SEED_PROBLEMS

class Command(BaseCommand):
    help = 'Seeds the database with 20 beginner-friendly coding problems.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding 20 coding problems...')
        count = 0
        for data in SEED_PROBLEMS:
            problem, created = Problem.objects.update_or_create(
                problem_number=data['problem_number'],
                defaults={
                    'title': data['title'],
                    'slug': data['slug'],
                    'difficulty': data['difficulty'],
                    'category': data['category'],
                    'description': data['description'],
                    'examples': data['examples'],
                    'constraints': data['constraints'],
                    'starter_code': data['starter_code'],
                    'test_cases': data['test_cases'],
                    'hidden_test_cases': data['hidden_test_cases'],
                }
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(SEED_PROBLEMS)} problems ({count} newly created).'))
