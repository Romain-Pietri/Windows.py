from django.contrib import admin
from django.urls import path
from .views import execute_command

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/command/', execute_command),
]