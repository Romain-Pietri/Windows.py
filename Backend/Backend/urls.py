from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/command/', execute_command),
    path('api/last_command/', get_last_command),
    path('api/news/', get_news),  # Nouvelle route pour récupérer les actualités
]
