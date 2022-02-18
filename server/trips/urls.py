from django.urls import path

from .views import TripListView, TripCreateView


app_name = 'trips'

urlpatterns = [
    path('', TripListView.as_view(), name='trips'),
    path('create/', TripCreateView.as_view(), name='trip_create'),
]
