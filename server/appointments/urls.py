from django.urls import path

from .views import AppointmentCreateView, AppointmentListView

app_name = 'appointments'

urlpatterns = [
    path('', AppointmentListView.as_view(), name='appointments_list'),
    path('create/', AppointmentCreateView.as_view(), name='appointment_create'),
    # path('<uuid:Appointment_id>', AppointmentDetailView.as_view(), name='appointment_detail'),
    # path('update/<uuid:Appointment_id>', AppointmentUpdateView.as_view(), name='appointment_update')
]
