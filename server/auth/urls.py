from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView, TokenVerifyView
from .views import SignUpView, LogInView

app_name = 'auth'

urlpatterns = [
    path('log_in/', LogInView.as_view(), name="log_in"),
    # blacklist token on logout
    path('logout/', TokenBlacklistView.as_view(), name='logout'),
    path('sign_up/', SignUpView.as_view(), name='sign_up'),
    # use valid refresh token for new access token
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    # verify if access token valid
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
