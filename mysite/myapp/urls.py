from django.urls import path
from . import views, api
from mysite.settings import API_VERSION

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
    path('account/account_register/', views.account_register_view, name='account_register'),
    path('account/account_login/', views.account_login_view, name='account_login'),
    path('account/account_change/', views.account_change_view, name='account_change'),
    path('account/account_logout/', views.account_logout_view, name='account_logout'),
    path('basket/add/', views.basket_add, name='basket_add'),
    path('basket/delete/', views.basket_delete, name='basket_delete'),
    path('basket/payment/', views.basket_payment, name='basket_payment'),
    path('basket/payment/success/<str:order_id>', views.basket_payment_success, name='basket_payment_success'),
    path('category_subcategory_sort/', views.category_subcategory_sort),
    path('category_subcategory_apply/', views.category_subcategory_apply),
    path('category_subcategory_reset/', views.category_subcategory_reset),


    # API urls
    path(f'api/{API_VERSION}/products/', api.ProductAPIView.as_view()),
    path(f'api/{API_VERSION}/products/create-random-products/', api.CreateRandomProductsAPI.as_view()),
    path(f'api/{API_VERSION}/products/create/', api.CreateProductAPI.as_view()),
    path(f'api/{API_VERSION}/categories/', api.CategoryAPIView.as_view()),
    path(f'api/{API_VERSION}/categories/create/', api.CreateCategoryAPI.as_view()),
    path(f'api/{API_VERSION}/subcategories/', api.SubcategoryAPIView.as_view()),
    path(f'api/{API_VERSION}/subcategories/create/', api.CreateSubcategoryAPI.as_view()),
    path(f'api/{API_VERSION}/brands/', api.BrandListCreateAPIView.as_view()),
    path(f'api/{API_VERSION}/suppliers/', api.SupplierListCreateAPIView.as_view()),
    path(f'api/{API_VERSION}/payments/', api.PaymentAPIView.as_view()),
]
