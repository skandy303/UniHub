from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.paginator import Paginator
from twilio.rest import Client
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import ChatGrant
import os
import openai
from listings.models import Convos
from accounts.models import User
from django.db.models import Q, Count
from .models import Listing, Image, Category, Subcategory
from .serializers import (
    ListingSerializer,
    CategorySerializer,
    SubcategorySerializer,
    StatisiticSerializer,
)
import re
from api.sendgrid import sendEmail
from sendgrid.helpers.mail import Mail
from django.conf import settings
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from api.openai import *
from api.messaging import *


class ListingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get("title")
        descrption = request.data.get("description")
        price = request.data.get("price")
        condition = request.data.get("condition")
        images = request.FILES.getlist("images")
        category = request.data.get("category")
        subcategory = request.data.get("subcategory")
        uuid = request.user.uuid
        invalidImages = {}
        if images == [] or images == None:
            return Response({"Error": f"Images are invalid"}, status=400)
        for j, i in enumerate(images):
            if re.search(r"\.(jpeg)|(.jpg)|(.img)$", i.name.lower().strip()) == None:
                invalidImages[j] = i.name
        if invalidImages != {}:
            return Response(
                {"Error": f"Images are invalid", "images": invalidImages}, status=400
            )

        if title == None:
            return Response({"Error": "Title parameter is undefined"}, status=400)
        if descrption == None:
            return Response({"Error": "Content parameter is undefined"}, status=400)
        if price == None:
            return Response({"Error": "Price parameter is undefined"}, status=400)
        if condition == None:
            return Response({"Error": "Condition parameter is undefined"}, status=400)
        if images == None:
            return Response({"Error": "Images parameter is undefined"}, status=400)
        if category == None:
            return Response({"Error": "Category parameter is undefined"}, status=400)
        if subcategory == None:
            return Response({"Error": "Subcategory parameter is undefined"}, status=400)
        if not (cat := Category.objects.filter(name=category)).exists():
            return Response({"Error": "Category does not exist"}, status=400)
        if not (subcategory := Subcategory.objects.filter(name=subcategory)).exists():
            return Response({"Error": "Subcategory does not exist"}, status=400)
        subcategory = subcategory[0]
        cat = cat[0]

        if subcategory.category != cat:
            return Response(
                {"Error": "Subcategory does not belong to category"}, status=400
            )

        try:
            user = User.objects.get(uuid=uuid)
            listing = Listing.objects.create(
                title=title.strip(),
                content=descrption.strip(),
                price=price,
                condition=condition,
                category=cat,
                subcategory=subcategory,
                user=user,
            )
            listing.save()
            for j, i in enumerate(images):
                image = Image.objects.create(listing=listing, file=i, order=(j + 1))
                image.save()
            return Response({"Success": "Listing created successfully"}, status=200)
        except Exception as e:
            return Response({"Listing could not be created": str(e)}, status=500)

    def get(self, request):
        pageNum = request.query_params.get("pageNum")
        count = request.query_params.get("count")
        listings = Listing.objects.all()

        if listings.count() > 0:
            paginator = Paginator(listings, count)
            if int(pageNum) > paginator.num_pages:
                return Response({"Error": "Page number is out of range"}, status=400)
            listings = paginator.page(pageNum)
            serializer = ListingSerializer(listings, many=True)
            return Response(
                {"Listings": serializer.data, "TotalPages": paginator.num_pages},
                status=200,
            )

        return Response({"Listings": [], "TotalPages": 0}, status=200)


class GetStatistics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.annotate(count=Count("listings"))
        serializer = StatisiticSerializer(categories, many=True)
        return Response(
            {
                "Listings": [a for a in serializer.data if a["count"] != 0],
            },
            status=200,
        )


class GetUserlistings(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        pageNum = request.query_params.get("pageNum")
        count = request.query_params.get("count")
        listings = Listing.objects.filter(user=user)
        totalCount = listings.count()

        if listings.count() > 0:
            paginator = Paginator(listings, count)
            if int(pageNum) > paginator.num_pages:
                return Response({"Error": "Page number is out of range"}, status=400)
            listings = paginator.page(pageNum)
            serializer = ListingSerializer(listings, many=True)
            return Response(
                {
                    "Listings": serializer.data,
                    "TotalPages": paginator.num_pages,
                    "TotalCount": totalCount,
                },
                status=200,
            )

        return Response({"Listings": [], "TotalPages": 0, "TotalCount": 0}, status=200)


class GetListing(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        if id == None:
            return Response({"Error": "ID parameter is undefined"}, status=400)
        try:
            listing = Listing.objects.get(id=id)
            serializer = ListingSerializer(listing)
            return Response(
                {"Listing": serializer.data, "Owner": listing.user == request.user},
                status=200,
            )
        except Exception as e:
            return Response({"Error": str(e)}, status=500)


from django.http import FileResponse, Http404


class GetImages(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, image_id):
        if image_id is None:
            return Response({"Error": "Image ID parameter is undefined"}, status=400)
        try:
            image = Image.objects.get(id=image_id)
        except Image.DoesNotExist:
            raise Http404("Image not found")

        # Construct the full path to the image file
        image_data = os.path.join(settings.MEDIA_ROOT, str(image.file.name))

        # Check if the file exists
        if not os.path.isfile(image_data):
            raise Http404("Image not found")

        # Return the image file as a response
        response = FileResponse(open(image_data, "rb"), content_type="image/jpeg")
        response["Cache-Control"] = "public, max-age=315360"
        return response


class SearchListingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        searchTerm = request.query_params.get("term")
        pageNum = request.query_params.get("pageNum")
        count = request.query_params.get("count")
        category = request.query_params.get("category")
        listings = Listing.objects.filter(title__icontains=searchTerm)
        if category != "All":
            listings = listings.filter(category__name=category)

        if listings.count() > 0:
            paginator = Paginator(listings, count)
            if int(pageNum) > paginator.num_pages:
                return Response({"Error": "Page number is out of range"}, status=400)
            listings = paginator.page(pageNum)
            serializer = ListingSerializer(listings, many=True)
            return Response(
                {"Listings": serializer.data, "TotalPages": paginator.num_pages},
                status=200,
            )

        return Response({"Listings": [], "TotalPages": 0}, status=200)


class BrowseListingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # TODO: Need to add request param validator (ie. Try catch)
        category = request.query_params.get("category")
        pageNum = request.query_params.get("pageNum")
        count = request.query_params.get("count")
        listings = Listing.objects.filter(category__name=category)
        data = []

        if listings.count() > 0:
            paginator = Paginator(listings, count)
            if int(pageNum) > paginator.num_pages:
                return Response({"Error": "Page number is out of range"}, status=400)

            listings = paginator.page(pageNum)
            serializer = ListingSerializer(listings, many=True)
            return Response(
                {"Listings": serializer.data, "TotalPages": paginator.num_pages},
                status=200,
            )

        return Response({"Listings": [], "TotalPages": 0}, status=200)


class DescriptionView(APIView):
    def get(self, request):
        description = request.GET.get("description")
        if description == None:
            return Response({"Error": "Description parameter is undefined"}, status=400)

        response = get_description(description)

        if response["Error"]:
            return Response({"Error": response["Message"]}, status=500)

        return Response(
            {"Description": response["Data"]["choices"][0]["text"]}, status=200
        )


class CategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        serialized_data = serializer.data
        return Response({"Categories": serialized_data}, status=200)


class SubCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        categories = Subcategory.objects.filter(category=id)
        serializer = SubcategorySerializer(categories, many=True)
        serialized_data = serializer.data
        return Response({"Subcategories": serialized_data}, status=200)


class CreateConversation(APIView):
    def get(self, request):
        listing = request.GET.get("Listing")
        customer = str(request.user.id)
        listings = None

        try:
            listings = Listing.objects.get(id=listing)
        except Exception as e:
            listing = "-1"

        # If a new conversation is not being created
        if listing == "-1" or listings.user_id == request.user.id:
            listings = (
                Convos.objects.select_related("listing")
                .filter(
                    Q(listing__user_id=request.user.id) | Q(customer=request.user.id)
                )
                .first()
            )
            if listings == None:
                return Response(
                    {"Error": "No conversations"}, status=status.HTTP_404_NOT_FOUND
                )

            response = get_convo_token(listings.meetingKey, request.user.name)
            if response["Error"]:
                return Response(
                    {"Error": response["Message"]}, status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {"Lister": response["Lister"], "Name": request.user.name},
                status=status.HTTP_200_OK,
            )
        else:
            convo, created = Convos.objects.get_or_create(
                listing=listings, customer=customer
            )

        if not created:
            meetingKey = convo.meetingKey
        else:

            response = create_conversation(listings.title, request.user.uuid, listing)
            if response["Error"]:
                return Response(
                    {"error": "Error creating conversation"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            meetingKey = response["Data"].sid
            convo.meetingKey = response["Data"].sid
            convo.save()

        # Get conversation SID
        response = get_sid(meetingKey)
        if response["Error"]:
            return Response(
                {"error": "Error getting conversation SID"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        chatSID = response["Data"].chat_service_sid

        response = add_participant(
            meetingKey, User.objects.get(id=listings.user_id).name
        )
        response = add_participant(meetingKey, request.user.name)
        # Create access token with credentials
        tokenLister = create_access_token(listing, chatSID)
        tokenCustomer = create_access_token(customer, chatSID)
        if tokenLister["Error"] or tokenCustomer["Error"]:
            return Response(
                {"error": "Error getting participant token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                "Lister": tokenLister["Data"],
                "Customer": tokenCustomer["Data"],
                "Name": request.user.name,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
class SendGridWebhookView(APIView):
    def post(self, request):
        payload = json.loads(request.body)

        for event in payload:
            if event["event"] == "delivered":
                print(
                    f"Email to {event['email']} was delivered at {event['timestamp']}."
                )
                # Handle the delivered event as needed

        return Response(status=200)
