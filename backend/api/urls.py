from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("email/", include("emails.urls")),
    path("listings/", include("listings.urls")),
    path("accounts/", include("accounts.urls")),
    path("payments/", include("payments.urls")),
]
