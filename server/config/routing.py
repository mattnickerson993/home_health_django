from django.core.asgi import get_asgi_application
from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter

from config.middleware import TokenAuthMiddlewareStack
from appointments.consumers import AppointmentConsumer
from trips.consumers import TripConsumer


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': TokenAuthMiddlewareStack(
        URLRouter([
            path('home_health/', TripConsumer.as_asgi()),
            path('home_health/appointments/', AppointmentConsumer.as_asgi()),
        ])
    ),
})
