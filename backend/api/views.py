from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q, Count
from datetime import date, timedelta

from api.models import Problem, Submission, UserProgress
from api.serializers import (
    UserSerializer, RegisterSerializer, ProblemListSerializer,
    ProblemDetailSerializer, SubmissionSerializer, RunCodeSerializer,
    SubmitCodeSerializer
)
from api.runner import CodeRunner

class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        solved_count = UserProgress.objects.filter(user=request.user, status='Solved').count()
        return Response({
            'user': serializer.data,
            'solved_count': solved_count
        })


class ProblemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Problem.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProblemDetailSerializer
        return ProblemListSerializer

    def get_queryset(self):
        queryset = Problem.objects.all()
        
        # Category Filter
        category = self.request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(category=category)

        # Difficulty Filter
        difficulty = self.request.query_params.get('difficulty')
        if difficulty and difficulty != 'All':
            queryset = queryset.filter(difficulty=difficulty)

        # Search Query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(problem_number__icontains=search) |
                Q(category__icontains=search)
            )

        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Problem.objects.count()
        easy = Problem.objects.filter(difficulty='Easy').count()
        medium = Problem.objects.filter(difficulty='Medium').count()
        hard = Problem.objects.filter(difficulty='Hard').count()

        solved_count = 0
        if request.user.is_authenticated:
            solved_count = UserProgress.objects.filter(user=request.user, status='Solved').count()

        return Response({
            'total_questions': total,
            'easy_questions': easy,
            'medium_questions': medium,
            'hard_questions': hard,
            'solved_questions': solved_count
        })


class RunCodeAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RunCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        problem_id = serializer.validated_data['problem_id']
        language = serializer.validated_data['language']
        code = serializer.validated_data['code']

        try:
            problem = Problem.objects.get(id=problem_id)
        except Problem.DoesNotExist:
            return Response({'error': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

        # Run against public sample test cases
        execution_res = CodeRunner.run_test_cases(
            code=code,
            language=language,
            problem_slug=problem.slug,
            test_cases=problem.test_cases
        )

        return Response(execution_res, status=status.HTTP_200_OK)


class SubmitCodeAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SubmitCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        problem_id = serializer.validated_data['problem_id']
        language = serializer.validated_data['language']
        code = serializer.validated_data['code']

        try:
            problem = Problem.objects.get(id=problem_id)
        except Problem.DoesNotExist:
            return Response({'error': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

        # Run against all hidden test cases
        all_test_cases = problem.test_cases + problem.hidden_test_cases
        execution_res = CodeRunner.run_test_cases(
            code=code,
            language=language,
            problem_slug=problem.slug,
            test_cases=all_test_cases
        )

        # Log submission if user is logged in
        submission = None
        if request.user.is_authenticated:
            submission = Submission.objects.create(
                user=request.user,
                problem=problem,
                language=language,
                code=code,
                status=execution_res['status'],
                execution_time=execution_res['execution_time'],
                test_cases_passed=execution_res['passed_count'],
                total_test_cases=execution_res['total_count'],
                error_message=execution_res.get('results', [{}])[0].get('error', '')
            )

            # Update UserProgress
            progress, created = UserProgress.objects.get_or_create(
                user=request.user,
                problem=problem,
                defaults={'status': 'Solved' if execution_res['status'] == 'Accepted' else 'Attempted'}
            )
            if not created:
                progress.attempts_count += 1
                if execution_res['status'] == 'Accepted':
                    progress.status = 'Solved'
                progress.save()

        return Response({
            'submission_id': submission.id if submission else None,
            'status': execution_res['status'],
            'passed_count': execution_res['passed_count'],
            'total_count': execution_res['total_count'],
            'execution_time': execution_res['execution_time'],
            'results': execution_res['results']
        }, status=status.HTTP_200_OK)


class UserDashboardAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            # Guest dashboard fallback stats
            total_probs = Problem.objects.count()
            return Response({
                'username': 'Guest User',
                'solved_total': 0,
                'total_problems': total_probs,
                'easy_solved': 0,
                'easy_total': Problem.objects.filter(difficulty='Easy').count(),
                'medium_solved': 0,
                'medium_total': Problem.objects.filter(difficulty='Medium').count(),
                'hard_solved': 0,
                'hard_total': Problem.objects.filter(difficulty='Hard').count(),
                'total_submissions': 0,
                'success_rate': 0.0,
                'streak': 0,
                'recent_submissions': []
            })

        user = request.user
        solved_probs = UserProgress.objects.filter(user=user, status='Solved').select_related('problem')
        
        easy_solved = solved_probs.filter(problem__difficulty='Easy').count()
        medium_solved = solved_probs.filter(problem__difficulty='Medium').count()
        hard_solved = solved_probs.filter(problem__difficulty='Hard').count()

        total_submissions = Submission.objects.filter(user=user).count()
        accepted_submissions = Submission.objects.filter(user=user, status='Accepted').count()
        
        success_rate = round((accepted_submissions / max(total_submissions, 1)) * 100, 1)

        # Compute Streak
        recent_subs = Submission.objects.filter(user=user).order_by('-created_at')
        streak = 0
        if recent_subs.exists():
            submission_dates = set(sub.created_at.date() for sub in recent_subs)
            today = date.today()
            current_date = today
            while current_date in submission_dates:
                streak += 1
                current_date -= timedelta(days=1)

        recent_submissions_data = SubmissionSerializer(recent_subs[:10], many=True).data

        return Response({
            'username': user.username,
            'solved_total': solved_probs.count(),
            'total_problems': Problem.objects.count(),
            'easy_solved': easy_solved,
            'easy_total': Problem.objects.filter(difficulty='Easy').count(),
            'medium_solved': medium_solved,
            'medium_total': Problem.objects.filter(difficulty='Medium').count(),
            'hard_solved': hard_solved,
            'hard_total': Problem.objects.filter(difficulty='Hard').count(),
            'total_submissions': total_submissions,
            'success_rate': success_rate,
            'streak': streak,
            'recent_submissions': recent_submissions_data
        })


class SubmissionHistoryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        submissions = Submission.objects.filter(user=request.user).order_by('-created_at')[:50]
        return Response(SubmissionSerializer(submissions, many=True).data)
