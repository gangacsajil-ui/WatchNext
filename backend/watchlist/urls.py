from rest_framework.routers import DefaultRouter
from .views import MediaViewSet, register, login
from django.urls import path

router = DefaultRouter()
router.register('media', MediaViewSet, basename='media')

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login),
] 

urlpatterns += router.urls