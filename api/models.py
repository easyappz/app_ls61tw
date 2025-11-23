from __future__ import annotations

import secrets
from typing import ClassVar

from django.db import models


class Member(models.Model):
    """Application member used for authentication and profile data.

    This model does not replace Django's default User model.
    """

    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.username

    @property
    def is_authenticated(self) -> bool:
        """Compatibility with DRF's IsAuthenticated permission class."""

        return True

    @property
    def is_anonymous(self) -> bool:
        return False


class MemberToken(models.Model):
    """Token used for authenticating Member instances.

    Format is compatible with DRF's token style: ``Token <key>``.
    """

    key = models.CharField(max_length=40, primary_key=True)
    member = models.OneToOneField(
        Member,
        related_name="auth_token",
        on_delete=models.CASCADE,
    )
    created = models.DateTimeField(auto_now_add=True)

    KEY_LENGTH: ClassVar[int] = 40

    class Meta:
        verbose_name = "Member token"
        verbose_name_plural = "Member tokens"

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.key

    @classmethod
    def generate_key(cls) -> str:
        """Generate a random token key.

        Uses URL-safe random bytes and truncates/expands to fixed length.
        """

        # 30 bytes -> 40+ chars when hex-encoded; slice to KEY_LENGTH.
        return secrets.token_hex(20)[: cls.KEY_LENGTH]
