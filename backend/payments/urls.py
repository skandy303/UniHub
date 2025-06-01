from django.urls import include, path
from . import views

urlpatterns = [
    path("create", views.StripeCreateAccountView.as_view()),
    path("connect", views.StripeCreateAccountLinkView.as_view()),
    path("checkout", views.StripeCheckoutView.as_view()),
    path("validate", views.ValidateStripeAccountView.as_view()),
]
