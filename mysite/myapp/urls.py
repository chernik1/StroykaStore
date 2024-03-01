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
    path('catalog/<str:category>/<str:subcategory>/', views.category_subcategory_view),
    path('catalog/<str:category>/<str:subcategory>/<str:product>/', views.product_view, name='product'),
    path('basket/', views.basket_view, name='basket'),
    path('orders/', views.orders_view, name='orders'),
]
