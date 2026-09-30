from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings


ALGORITHM = "HS256"


def create_access_token(
    user_id: int,
    role: str,
) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.secret_key,
        algorithms=[ALGORITHM],
    )