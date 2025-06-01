from django.contrib import admin
from django.urls import include, path
from .views import EmailView

urlpatterns = [path("sendEmail", EmailView.as_view())]
