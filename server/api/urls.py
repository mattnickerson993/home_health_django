from django.urls import path, include

app_name = 'api_v1'

urlpatterns = [
    path('appointments/', include('appointments.urls', namespace='appointments')),
    path('trips/', include('trips.urls', namespace='trips')),
]
