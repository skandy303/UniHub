from django.conf import settings
import stripe
import os

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")


def create_stripe_checkout_session(listing_id, listing, seller, user):
    try:
        checkout_session = stripe.checkout.Session.create(
            success_url=settings.FRONTEND_SITE_URL
            + "/listing/"
            + str(listing_id)
            + "/?success=true",
            cancel_url=settings.FRONTEND_SITE_URL
            + "/listing/"
            + str(listing_id)
            + "/?canceled=true",
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "cad",
                        "unit_amount_decimal": listing.price * 100,
                        "product_data": {
                            "name": listing.title,
                        },
                    },
                    "quantity": 1,
                },
            ],
            mode="payment",
            payment_intent_data={
                "setup_future_usage": "off_session",
                "transfer_data": {
                    "destination": seller.stripe_account_id,
                },
            },
            metadata={
                "customer_id": user.id,
            },
        )
        return {"success": True, "redirect_url": checkout_session.url}
    except:
        return {"success": False, "message": "Error creating Stripe checkout session"}


def create_stripe_account(user):
    try:
        account = stripe.Account.create(
            type="express",
            country="CA",
            email=user.email,
            capabilities={
                "card_payments": {"requested": True},
                "transfers": {"requested": True},
            },
            business_type="individual",
            individual={
                "email": user.email,
            },
            metadata={
                "unihub_id": user.id,
            },
        )
        return {"success": True, "account_id": account.id}

    except:
        return {"success": False, "message": "Error creating Stripe checkout session"}


def create_stripe_account_link(user):
    try:
        account_link = stripe.AccountLink.create(
            account=user.stripe_account_id,
            refresh_url=settings.FRONTEND_SITE_URL + "/profile",
            return_url=settings.FRONTEND_SITE_URL + "/profile",
            type="account_onboarding",
        )
        return {"success": True, "redirect_url": account_link.url}
    except:
        return {"success": False, "message": "Error creating Stripe account link"}


def get_stripe_account(user):
    try:
        account = stripe.Account.retrieve(user.stripe_account_id)
        return {"success": True, "account_id": account.id}
    except:
        return {"success": False, "message": "Error retrieving Stripe account"}
