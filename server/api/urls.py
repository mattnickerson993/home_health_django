from django.urls import path, include

app_name = 'api_v1'

urlpatterns = [
    path('appointments/', include('appointments.urls', namespace='appointments')),
    path('apt_messages/', include('apt_messages.urls', namespace='apt_messages')),
]
