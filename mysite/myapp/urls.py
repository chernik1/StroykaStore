from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('brands/', views.brands, name='brands'),
    path('delivery/', views.delivery, name='delivery'),
    path('return/', views.return_tab, name='return'),
    path('documentation/', views.documentation, name='documentation'),
    path('contacts/', views.contacts, name='contacts'),
    path('account/', views.account, name='account'),
    path('catalog/', views.catalog, name='catalog'),
]
