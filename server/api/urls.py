from django.urls import path, include

app_name = 'api_v1'

urlpatterns = [
    path('trips/', include('trips.urls', namespace='trips')),
]
