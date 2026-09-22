from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q, Count
from datetime import date, timedelta

from api.models import Problem, Submission, UserProgress, UserProfile, Badge
from api.serializers import (
    UserSerializer, RegisterSerializer, ProblemListSerializer,
    ProblemDetailSerializer, SubmissionSerializer, RunCodeSerializer,
    SubmitCodeSerializer, UserProfileSerializer, BadgeSerializer,
    AIHintRequestSerializer, AIExplainRequestSerializer, AIDebugRequestSerializer,
    AILearnRequestSerializer, AIGenerateProblemRequestSerializer, AdminProblemSerializer
)
from api.runner import CodeRunner
from api.ai_service import AIService
from api.recommendations import RecommendationEngine
from api.gamification import GamificationEngine


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            GamificationEngine.get_or_create_profile(user)
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
        profile = GamificationEngine.get_or_create_profile(request.user)
        GamificationEngine.update_streak(profile)
        GamificationEngine.evaluate_badges(request.user, profile)
        profile.save()

        solved_count = UserProgress.objects.filter(user=request.user, status='Solved').count()
        profile_data = UserProfileSerializer(profile).data
        user_data = UserSerializer(request.user).data

        return Response({
            'user': user_data,
            'profile': profile_data,
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

        # Status Filter (Solved / Unsolved)
        status_filter = self.request.query_params.get('status')
        if status_filter and self.request.user.is_authenticated:
            if status_filter == 'Solved':
                solved_ids = UserProgress.objects.filter(user=self.request.user, status='Solved').values_list('problem_id', flat=True)
                queryset = queryset.filter(id__in=solved_ids)
            elif status_filter == 'Unsolved':
                solved_ids = UserProgress.objects.filter(user=self.request.user, status='Solved').values_list('problem_id', flat=True)
                queryset = queryset.exclude(id__in=solved_ids)

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
        custom_input = serializer.validated_data.get('custom_input', '')

        try:
            problem = Problem.objects.get(id=problem_id)
        except Problem.DoesNotExist:
            return Response({'error': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

        if custom_input.strip():
            test_cases = [{'input': custom_input, 'expected_output': 'Custom Input Run'}]
        else:
            test_cases = problem.test_cases

        execution_res = CodeRunner.run_test_cases(
            code=code,
            language=language,
            problem_slug=problem.slug,
            test_cases=test_cases
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

        all_test_cases = problem.test_cases + problem.hidden_test_cases
        execution_res = CodeRunner.run_test_cases(
            code=code,
            language=language,
            problem_slug=problem.slug,
            test_cases=all_test_cases
        )

        submission = None
        rewards = None

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
                error_message=execution_res.get('results', [{}])[0].get('error', '') if execution_res.get('results') else ''
            )

            # Check if first solve
            is_first_solve = not UserProgress.objects.filter(user=request.user, problem=problem, status='Solved').exists()

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

            # Award XP & update streak
            rewards = GamificationEngine.update_submission_rewards(
                user=request.user,
                problem=problem,
                is_accepted=(execution_res['status'] == 'Accepted'),
                is_first_solve=is_first_solve
            )

        return Response({
            'submission_id': submission.id if submission else None,
            'status': execution_res['status'],
            'passed_count': execution_res['passed_count'],
            'total_count': execution_res['total_count'],
            'execution_time': execution_res['execution_time'],
            'results': execution_res['results'],
            'rewards': rewards
        }, status=status.HTTP_200_OK)


# --- AI TUTOR API ENDPOINTS ---

class AIHintAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AIHintRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            problem = Problem.objects.get(id=serializer.validated_data['problem_id'])
        except Problem.DoesNotExist:
            return Response({'error': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

        hint_res = AIService.generate_hint(
            problem_title=problem.title,
            problem_category=problem.category,
            problem_description=problem.description,
            hints_list=problem.hints,
            current_hint_level=serializer.validated_data['current_hint_level']
        )
        return Response(hint_res, status=status.HTTP_200_OK)


class AIExplainAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AIExplainRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            problem = Problem.objects.get(id=serializer.validated_data['problem_id'])
        except Problem.DoesNotExist:
            return Response({'error': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

        exp_res = AIService.explain_code(
            problem_title=problem.title,
            user_code=serializer.validated_data['code'],
            language=serializer.validated_data['language']
        )
        return Response(exp_res, status=status.HTTP_200_OK)


class AIDebugAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AIDebugRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            problem = Problem.objects.get(id=serializer.validated_data['problem_id'])
        except Problem.DoesNotExist:
            return Response({'error': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

        debug_res = AIService.debug_code(
            problem_title=problem.title,
            user_code=serializer.validated_data['code'],
            error_message=serializer.validated_data.get('error_message', ''),
            language=serializer.validated_data['language']
        )
        return Response(debug_res, status=status.HTTP_200_OK)


class AILearnAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AILearnRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        learn_res = AIService.teach_concept(
            topic=serializer.validated_data['topic'],
            user_question=serializer.validated_data.get('question', ''),
            problem_title=serializer.validated_data.get('problem_title', '')
        )
        return Response(learn_res, status=status.HTTP_200_OK)


class AIGenerateProblemAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AIGenerateProblemRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        generated_data = AIService.generate_problem(
            topic=serializer.validated_data['topic'],
            difficulty=serializer.validated_data['difficulty'],
            language=serializer.validated_data['language'],
            concept=serializer.validated_data['concept']
        )

        # Check if user requested saving immediately to DB
        save_to_db = request.data.get('save_to_db', False)
        if save_to_db:
            max_num = Problem.objects.count() + 1
            new_prob = Problem.objects.create(
                problem_number=max_num,
                title=generated_data.get('title', f"AI {serializer.validated_data['topic']} Problem"),
                slug=generated_data.get('slug', f"ai-prob-{max_num}"),
                difficulty=generated_data.get('difficulty', 'Easy'),
                category=generated_data.get('category', 'Arrays'),
                description=generated_data.get('description', ''),
                examples=generated_data.get('examples', []),
                constraints=generated_data.get('constraints', []),
                starter_code=generated_data.get('starter_code', {}),
                test_cases=generated_data.get('test_cases', []),
                hidden_test_cases=generated_data.get('hidden_test_cases', []),
                hints=generated_data.get('hints', []),
                solution_explanation=generated_data.get('solution_explanation', ''),
                time_complexity=generated_data.get('time_complexity', 'O(N)'),
                space_complexity=generated_data.get('space_complexity', 'O(1)'),
                is_ai_generated=True
            )
            return Response({'message': 'Problem generated and saved to database!', 'problem_id': new_prob.id, 'problem': ProblemDetailSerializer(new_prob).data}, status=status.HTTP_201_CREATED)

        return Response({'generated_problem': generated_data}, status=status.HTTP_200_OK)


# --- RECOMMENDATIONS & GAMIFICATION APIs ---

class RecommendationsAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        recs = RecommendationEngine.get_recommendations(request.user)
        return Response(recs, status=status.HTTP_200_OK)


class GamificationAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = GamificationEngine.get_or_create_profile(request.user)
        return Response(UserProfileSerializer(profile).data, status=status.HTTP_200_OK)


class UserDashboardAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            total_probs = Problem.objects.count()
            return Response({
                'username': 'Guest Developer',
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
                'xp': 0,
                'level': 1,
                'recent_submissions': []
            })

        user = request.user
        profile = GamificationEngine.get_or_create_profile(user)
        solved_probs = UserProgress.objects.filter(user=user, status='Solved').select_related('problem')
        
        easy_solved = solved_probs.filter(problem__difficulty='Easy').count()
        medium_solved = solved_probs.filter(problem__difficulty='Medium').count()
        hard_solved = solved_probs.filter(problem__difficulty='Hard').count()

        total_submissions = Submission.objects.filter(user=user).count()
        accepted_submissions = Submission.objects.filter(user=user, status='Accepted').count()
        
        success_rate = round((accepted_submissions / max(total_submissions, 1)) * 100, 1)
        recent_subs = Submission.objects.filter(user=user).order_by('-created_at')

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
            'streak': profile.streak,
            'xp': profile.xp,
            'level': profile.level,
            'recent_submissions': SubmissionSerializer(recent_subs[:10], many=True).data
        })


class SubmissionHistoryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        submissions = Submission.objects.filter(user=request.user).order_by('-created_at')[:50]
        return Response(SubmissionSerializer(submissions, many=True).data)


# --- ADMIN API ENDPOINTS ---

class AdminProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = AdminProblemSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminStatsAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({
            'total_users': User.objects.count(),
            'total_problems': Problem.objects.count(),
            'total_submissions': Submission.objects.count(),
            'accepted_submissions': Submission.objects.filter(status='Accepted').count(),
            'ai_generated_problems': Problem.objects.filter(is_ai_generated=True).count(),
        })
