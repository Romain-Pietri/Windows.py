from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/command/', execute_command),
    path('api/last_command/', get_last_command),
    path('api/send_message/', send_message),
    path('api/get_message/', get_message),
    path('api/get_conversation/', get_conversation),

]