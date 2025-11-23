from typing import Optional, Tuple

from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .models import Member, MemberToken


class MemberTokenAuthentication(BaseAuthentication):
    """Simple token authentication for Member model using Authorization header.

    Expected header format:
        Authorization: Token <token>
    """

    keyword = "Token"

    def authenticate(self, request) -> Optional[Tuple[Member, MemberToken]]:  # type: ignore[override]
        auth = get_authorization_header(request).split()

        if not auth:
            return None

        if len(auth) != 2:
            raise AuthenticationFailed("Неверный формат заголовка авторизации.")

        try:
            keyword = auth[0].decode("utf-8")
            token_key = auth[1].decode("utf-8")
        except UnicodeError as exc:  # pragma: no cover - defensive
            raise AuthenticationFailed("Неверный токен авторизации.") from exc

        if keyword != self.keyword:
            # This authenticator does not handle this type of auth
            return None

        try:
            token = MemberToken.objects.select_related("member").get(key=token_key)
        except MemberToken.DoesNotExist:
            raise AuthenticationFailed("Неверный токен авторизации.")

        member = token.member

        return member, token
