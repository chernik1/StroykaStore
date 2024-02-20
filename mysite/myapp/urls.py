from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('brands/', views.brands, name='brands'),
    path('delivery/', views.delivery, name='delivery'),
]