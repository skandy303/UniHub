from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import redirect

from django.conf import settings
from listings.models import Listing
from accounts.models import User
from api.stripe import *


class StripeCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listing_id = request.query_params.get("listing")
        listing = Listing.objects.get(pk=int(listing_id))
        seller = User.objects.get(pk=listing.user.id)

        stripe_response = create_stripe_checkout_session(
            listing_id, listing, seller, request.user
        )

        if stripe_response["success"]:
            return Response(
                {"redirect_url": stripe_response["redirect_url"]}, status=200
            )
        else:
            return Response(
                {"message": "Error creating Stripe checkout session"}, status=500
            )


class StripeCreateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.stripe_account_id:
            return Response(
                {"message": "Stripe account has already been created"}, status=500
            )
        # create stripe account
        stripe_response = create_stripe_account(request.user)

        # set newly created stripe account id to user
        if stripe_response["success"]:
            request.user.stripe_account_id = stripe_response["account_id"]
            request.user.save()
            return Response(
                {"message": "Stripe account has been created and connected"}, status=200
            )
        else:
            return Response({"message": "Error creating stripe account"}, status=500)


class StripeCreateAccountLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stripe_response = create_stripe_account_link(request.user)
        if stripe_response["success"]:
            return Response(
                {"redirect_url": stripe_response["redirect_url"]}, status=200
            )
        else:
            return Response(
                {"message": "Error creating Stripe account link"}, status=500
            )


class ValidateStripeAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(pk=request.query_params.get("user"))
        if user.stripe_account_id == "":
            return Response(
                {"message": "Stripe account has not been created"}, status=404
            )

        stripe_response = get_stripe_account(user)
        if stripe_response["success"]:
            return Response({"account": stripe_response["account_id"]}, status=200)
        else:
            return Response({"message": "Error getting Stripe account"}, status=500)
