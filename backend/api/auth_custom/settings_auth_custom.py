# api/auth_custom/settings.py
from datetime import timedelta

JWT_SETTINGS = {
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'TOKEN_USER_CLASS': 'api.models.user.User',
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

AUTH_SETTINGS = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'api.auth_custom.authentication.CustomJWTAuthentication',
    ),
}
