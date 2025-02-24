from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/command/', execute_command),
    path('api/last_command/', get_last_command),
    path('api/ip/', get_ip_address),
    path('api/location/', get_location),
    path('api/weather/', get_weather),
    path('api/open_weather/', get_open_weather),
    path('api/open_weather2/', get_open_weather2),
]