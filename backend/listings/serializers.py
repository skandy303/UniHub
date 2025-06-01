from rest_framework import serializers
from .models import Category, Subcategory, Listing, Image
from accounts.serializers import UserRetrievalSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class StatisiticSerializer(serializers.ModelSerializer):
    count = serializers.IntegerField()

    class Meta:
        model = Category
        fields = ("id", "name", "count")


class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "__all__"


class ListingSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    subcategory = SubcategorySerializer()
    images = serializers.SerializerMethodField()
    user = UserRetrievalSerializer()  # Add this line to include the user information

    class Meta:
        model = Listing
        fields = (
            "id",
            "category",
            "subcategory",
            "title",
            "content",
            "price",
            "date",
            "condition",
            "user",
            "images",
        )

    def get_images(self, obj):
        images = obj.images.all().order_by("order")
        return ImageSerializer(images, many=True).data
