from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    RegisterAPIView, UserProfileAPIView, ProblemViewSet,
    RunCodeAPIView, SubmitCodeAPIView, UserDashboardAPIView,
    SubmissionHistoryAPIView, AIHintAPIView, AIExplainAPIView,
    AIDebugAPIView, AILearnAPIView, AIGenerateProblemAPIView,
    RecommendationsAPIView, GamificationAPIView, AdminProblemViewSet,
    AdminStatsAPIView
)

router = DefaultRouter()
router.register('problems', ProblemViewSet, basename='problem')
router.register('admin/problems', AdminProblemViewSet, basename='admin-problem')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserProfileAPIView.as_view(), name='user_profile'),

    # Code Execution
    path('run/', RunCodeAPIView.as_view(), name='run_code'),
    path('submit/', SubmitCodeAPIView.as_view(), name='submit_code'),

    # AI Tutor & Generator
    path('ai/hint/', AIHintAPIView.as_view(), name='ai_hint'),
    path('ai/explain/', AIExplainAPIView.as_view(), name='ai_explain'),
    path('ai/debug/', AIDebugAPIView.as_view(), name='ai_debug'),
    path('ai/learn/', AILearnAPIView.as_view(), name='ai_learn'),
    path('ai/generate/', AIGenerateProblemAPIView.as_view(), name='ai_generate'),

    # Personalized Learning & Recommendations
    path('recommendations/', RecommendationsAPIView.as_view(), name='recommendations'),

    # Gamification
    path('gamification/', GamificationAPIView.as_view(), name='gamification'),

    # Dashboard & History
    path('dashboard/', UserDashboardAPIView.as_view(), name='user_dashboard'),
    path('submissions/', SubmissionHistoryAPIView.as_view(), name='submission_history'),

    # Admin Stats
    path('admin/stats/', AdminStatsAPIView.as_view(), name='admin_stats'),

    # Router endpoints (problems list/detail/stats and admin problem CRUD)
    path('', include(router.urls)),
]
