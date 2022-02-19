from django.urls import path

from .views import TripListView, TripCreateView, TripDetailView, TripUpdateView

app_name = 'trips'

urlpatterns = [
    path('', TripListView.as_view(), name='trips_list'),
    path('create/', TripCreateView.as_view(), name='trip_create'),
    path('<uuid:trip_id>', TripDetailView.as_view(), name='trip_detail'),
    path('update/<uuid:trip_id>', TripUpdateView.as_view(), name='trip_update')
]
