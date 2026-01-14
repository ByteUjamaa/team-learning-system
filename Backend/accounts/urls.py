from django.urls import path
from . import views
from .views import RegisterView, LoginView, LogoutView, ChangePasswordView, CurrentUserProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Profile endpoints
    path('profiles/me/', CurrentUserProfileView.as_view(), name='profile-current'),
    path('profiles/', views.UserProfileCreateView.as_view(), name='profile-create'),
    path('profiles/<int:pk>/', views.UserProfileView.as_view(), name='profile-update'),
    path('profiles/<int:pk>/delete/', views.UserProfileDeleteView.as_view(), name='profile-delete'),
    path('profiles/list/', views.UserProfileListView.as_view(), name='profile-list'),
    path('profiles/<int:pk>/detail/', views.UserProfileDetailView.as_view(), name='profile-detail'),
]
