from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.views import TokenObtainPairView

from auth.serializers import LoginSerializer
from users.serializers import UserSerializer

USER = get_user_model()


class SignUpView(generics.CreateAPIView):
    # parser_classes = (MultiPartParser,)
    queryset = USER.objects.all()
    serializer_class = UserSerializer




class LogInView(TokenObtainPairView):
    serializer_class = LoginSerializer
