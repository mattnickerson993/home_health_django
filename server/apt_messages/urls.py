from django.urls import path

from .views import MessageListView

app_name = 'apt_messages'

urlpatterns = [
    path('messages/<uuid:apt_id>', MessageListView.as_view(), name='apt_message_list'),
]
