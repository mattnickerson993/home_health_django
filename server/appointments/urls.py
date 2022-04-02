from django.urls import path

from .views import (
    AppointmentAvailablePatientView,
    AppointmentCreateView,
    AppointmentListView,
    AppointmentDetailView,
    AppointmentUpdateView,
)

app_name = 'appointments'

urlpatterns = [
    path('', AppointmentListView.as_view(), name='appointments_list'),
    path('create/', AppointmentCreateView.as_view(), name='appointment_create'),
    path('<uuid:Appointment_id>', AppointmentDetailView.as_view(), name='appointment_detail'),
    path('update/<uuid:Appointment_id>', AppointmentUpdateView.as_view(), name='appointment_update'),
    path('available_patients', AppointmentAvailablePatientView.as_view(), name="available_patients"),
]
