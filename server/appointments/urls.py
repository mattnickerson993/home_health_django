from django.urls import path

from .views import (
    AppointmentAvailablePatientView,
    AppointmentCreateView,
    AppointmentListView,
    AppointmentDetailView,
    AppointmentUpdateView,
    AppointmentPastListView
)

app_name = 'appointments'

urlpatterns = [
    path('', AppointmentListView.as_view(), name='appointments_list'),
    path('available_patients', AppointmentAvailablePatientView.as_view(), name="available_patients"),
    path('create/', AppointmentCreateView.as_view(), name='appointment_create'),
    path('past/', AppointmentPastListView.as_view(), name='appointments_past_list'),
    path('<uuid:appointment_id>', AppointmentDetailView.as_view(), name='appointment_detail'),
    path('update/<uuid:appointment_id>', AppointmentUpdateView.as_view(), name='appointment_update'),
]
