from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Member


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class MemberSerializer(serializers.ModelSerializer):
    """Serializer for reading member profile information."""

    class Meta:
        model = Member
        fields = ["id", "username", "created_at"]
        read_only_fields = ["id", "created_at"]


class MemberRegistrationSerializer(serializers.ModelSerializer):
    """Serializer used for member registration.

    Accepts ``username`` and ``password``; stores password hashed.
    """

    password = serializers.CharField(write_only=True, min_length=1)

    class Meta:
        model = Member
        fields = ["username", "password"]

    def create(self, validated_data):
        raw_password = validated_data.pop("password")
        member = Member.objects.create(
            password=make_password(raw_password),
            **validated_data,
        )
        return member
