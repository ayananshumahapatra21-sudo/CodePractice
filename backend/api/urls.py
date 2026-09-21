from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    RegisterAPIView, UserProfileAPIView, ProblemViewSet,
    RunCodeAPIView, SubmitCodeAPIView, UserDashboardAPIView,
    SubmissionHistoryAPIView
)

router = DefaultRouter()
router.register('problems', ProblemViewSet, basename='problem')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserProfileAPIView.as_view(), name='user_profile'),

    # Code Execution
    path('run/', RunCodeAPIView.as_view(), name='run_code'),
    path('submit/', SubmitCodeAPIView.as_view(), name='submit_code'),

    # User Progress & Dashboard
    path('dashboard/', UserDashboardAPIView.as_view(), name='user_dashboard'),
    path('submissions/', SubmissionHistoryAPIView.as_view(), name='submission_history'),

    # Router endpoints (problems list/detail/stats)
    path('', include(router.urls)),
]
