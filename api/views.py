from django.contrib.auth.hashers import check_password
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import MemberTokenAuthentication
from .models import Member, MemberToken
from .serializers import (
    MemberRegistrationSerializer,
    MemberSerializer,
    MessageSerializer,
)


class HelloView(APIView):
    """A simple API endpoint that returns a greeting message."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        responses={200: MessageSerializer},
        description="Get a hello world message",
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    """Register a new member and return auth token."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=MemberRegistrationSerializer,
        responses={
            201: MemberSerializer,
            400: None,
        },
        description="Регистрация нового пользователя (member)",
    )
    def post(self, request):
        serializer = MemberRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        member = serializer.save()

        token, created = MemberToken.objects.get_or_create(member=member)
        if created:
            token.key = MemberToken.generate_key()
            token.save(update_fields=["key"])

        member_data = MemberSerializer(member).data
        return Response(
            {"member": member_data, "token": token.key},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Authenticate existing member and return auth token."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=MemberRegistrationSerializer,
        responses={
            200: MemberSerializer,
            400: None,
        },
        description="Авторизация пользователя (member)",
    )
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Необходимо указать имя пользователя и пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            return Response(
                {"detail": "Неверное имя пользователя или пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(password, member.password):
            return Response(
                {"detail": "Неверное имя пользователя или пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token, created = MemberToken.objects.get_or_create(member=member)
        if created:
            token.key = MemberToken.generate_key()
            token.save(update_fields=["key"])

        member_data = MemberSerializer(member).data
        return Response({"member": member_data, "token": token.key})


class MeView(APIView):
    """Return profile information for the current authenticated member."""

    authentication_classes = [MemberTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: MemberSerializer},
        description="Получение данных текущего пользователя",
    )
    def get(self, request):
        member = request.user
        serializer = MemberSerializer(member)
        return Response(serializer.data)


class LogoutView(APIView):
    """Logout current member by deleting their auth token."""

    authentication_classes = [MemberTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: None},
        description="Выход пользователя (удаление токена)",
    )
    def post(self, request):
        member = request.user
        MemberToken.objects.filter(member=member).delete()
        return Response({"detail": "Вы успешно вышли."})
