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
    path('catalog/<slug:category_slug>/', views.category_catalog, name='category_catalog'),
    # path('categories/', views.categories, name='categories'),
    # path('item/', views.item, name='item'),
    # path('orders/', views.orders, name='orders'),
    # path('basket/', views.basket, name='basket'),
]
