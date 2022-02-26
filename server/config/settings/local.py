from .base import *
from .base import env


ALLOWED_HOSTS = ['localhost', '0.0.0.0', '127.0.0.1']


INTERNAL_IPS = ["127.0.0.1"]


CORS_ORIGIN_WHITELIST = [
    "http://localhost:3001",
    "http://localhost:3000",
]
