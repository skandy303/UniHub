from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("login", views.LoginView.as_view()),
    path("logout", views.LogoutView.as_view()),
    path("me", views.UserView.as_view()),
]
