from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('auth.urls', namespace='auth')),
    path('api/v1/', include('api.urls', namespace='api_v1')),
]
