from requests import Response
from django.http import JsonResponse
from rest_framework.views import APIView
import requests
from accounts.models import User
import ssl
from django.contrib.sessions.backends.db import SessionStore
from django.core import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout


from .serializers import (
    UserRetrievalSerializer,
)


class LoginView(APIView):
    def post(self, request):
        if request.data.get("headers") == None:
            return JsonResponse(
                dict(message="Authorization header is undefined"), status=400
            )

        UserInfo = requests.get(
            "https://unihub.us.auth0.com/userinfo",
            headers={"Authorization": request.data.get("headers").get("Authorization")},
        )
        if UserInfo.status_code != 200:
            return JsonResponse(
                dict(message="Invalid access token"), status=UserInfo.status_code
            )
        UserInfo = UserInfo.json()
        User.objects.get_or_create(
            email=UserInfo.get("email"),
            auth_id=UserInfo.get("sub"),
            name=UserInfo.get("name"),
            password="password",
        )
        user = User.objects.get(auth_id=UserInfo.get("sub"))
        login(request, user)
        return JsonResponse(dict(message="Logged in successfully"), status=200)

    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse(UserRetrievalSerializer(request.user).data, status=200)
        else:
            return JsonResponse(dict(message="User is not logged in"), status=400)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request.user)
        if not request.user.is_authenticated:
            return JsonResponse(dict(message="User is not logged in"), status=200)
        logout(request)
        return JsonResponse(dict(message="Logged out successfully"), status=200)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"userId": request.user.id}, status=200)
