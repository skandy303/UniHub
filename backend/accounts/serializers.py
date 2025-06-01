from rest_framework import serializers

from accounts.models import User


class UserRetrievalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email", "uuid")
