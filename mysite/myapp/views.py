from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
import json
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from .models import *
from django.db.utils import IntegrityError

# Create your views here.

def index(request):
    return render(request, 'index.html')

def brands(request):

    brands = Brand.objects.all()
    letter_brands = {}
    eng_letters = []
    rus_letters = []

    for brand in brands:
        letter = brand.name[0]
        if not letter in letter_brands.keys():
            letter_brands[letter] = [brand]
            if letter.lower() in 'abcdefghijklmnopqrstuvwxyz':
                eng_letters.append(letter.upper())
            else:
                rus_letters.append(letter.upper())
        else:
            letter_brands[letter].append(brand)

    context = {
        'letter_brands': letter_brands,
        'eng_letters': eng_letters,
        'rus_letters': rus_letters
    }

    return render(request, 'brands.html', context=context)

def delivery(request):
    return render(request, 'delivery.html')

def return_tab(request):
    return render(request, 'return.html')

def documentation(request):
    return render(request, 'documentation.html')

def contacts(request):
    return render(request, 'contacts.html')

def account(request):
    if request.user.is_authenticated:
        user = request.user

        data = {
            'name': user.name,
            'surname': user.surname,
            'email': user.email,
            'phone': user.phone,
            'birthday': user.birthday,
        }

        context = {
            'data': data,
        }

        return render(request, 'account.html')
    return render(request, 'index.html')

def catalog(request):
    categories = Category.objects.all()
    suppliers = Supplier.objects.all()
    subcategories = Subcategory.objects.all()

    data = {}

    for subcategory in subcategories:
        if not subcategory.category in data.keys():
            data[subcategory.category] = [subcategory.name]
        else:
            data[subcategory.category].append(subcategory.name)

    context = {
        'categories': categories,
        'suppliers': suppliers,
        'data': data
    }

    return render(request, 'catalog.html', context=context)

def category_subcategory_view(request, category: str, subcategory: str):
    categories = Category.objects.all().filter(name=category)
    subcategories = Subcategory.objects.all().filter(name=subcategory)
    products = Product.objects.all().filter(subcategory__in=subcategories)

    brands = [product.brand.all() for product in products if product.brand.all()][0]
    suppliers = list(set([product.supplier.all() for product in products if product.supplier.all()][0]))

    context = {
        'categories': categories,
        'subcategories': subcategories,
        'products': products,
        'category': category,
        'subcategory': subcategory,
        'brands': brands,
        'suppliers': suppliers
    }

    return render(request, 'category_catalog.html', context=context)

def product_view(request, category: str, subcategory: str, product: str):
    product = Product.objects.get(name=product)
    supplier = ', '.join([supplier.name for supplier in product.supplier.all()])
    category = Category.objects.get(name=category)

    context = {
        'product': product,
        'supplier': supplier,
        'category': category,
    }

    return render(request, 'product.html', context=context)

def basket_view(request):
    supplier = 'Gibson'

    context = {
        'supplier': supplier
    }

    return render(request, 'basket.html', context=context)

def orders_view(request):
    return render(request, 'orders.html')

def account_register_view(request):
    try:
        CustomUser.objects.create_user(
            email=request.POST.get('email'),
            name=request.POST.get('name'),
            password=request.POST.get('newPassword')
        )

        return JsonResponse({'success': True})

    except IntegrityError as e:
        return JsonResponse({'success': False, 'error': 'Такой пользователь уже существует'})
    except ValueError as e:
        return JsonResponse({'success': False, 'error': 'Некорректные данные'})


def account_login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        User = get_user_model()
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'is_authenticated': user.is_authenticated})
        else:
            print('User not found')
            return JsonResponse({'success': False, 'is_authenticated': False})