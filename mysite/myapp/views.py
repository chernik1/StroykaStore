from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from .models import *
from django.db.utils import IntegrityError
from datetime import datetime

# Create your views here.

def index(request):

    context = {
        'user': request.user
    }

    return render(request, 'index.html', context=context)

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
        'rus_letters': rus_letters,
        'user': request.user
    }

    return render(request, 'brands.html', context=context)

def delivery(request):

    context = {
        'user': request.user
    }

    return render(request, 'delivery.html', context=context)

def return_tab(request):

    context = {
        'user': request.user
    }

    return render(request, 'return.html', context=context)

def documentation(request):

    context = {
        'user': request.user
    }

    return render(request, 'documentation.html', context=context)

def contacts(request):

    context = {
        'user': request.user
    }

    return render(request, 'contacts.html', context=context)

def account(request):
    if request.user.is_authenticated:
        user = request.user

        if user.surname is None:
            user.surname = ''
        if user.birthday is None:
            user.birthday = ''
        else:
            user.birthday = datetime.strftime(user.birthday, '%d.%m.%Y')
        if user.phone is None:
            user.phone = ''


        context = {
            'name': user.name,
            'surname': user.surname,
            'birthday': user.birthday,
            'phone': user.phone,
            'email': user.email,
            'user': request.user
        }

        return render(request, 'account.html', context=context)
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
        'data': data,
        'user': request.user
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
        'suppliers': suppliers,
        'user': request.user
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
        'user': request.user
    }

    return render(request, 'product.html', context=context)

def basket_view(request):
    if request.user.is_authenticated:
        pass
    else:
        context = {
            'user': request.user
        }
        return render(request, 'unlogin.html', context=context)

def orders_view(request):
    if request.user.is_authenticated:
        pass
    else:
        context = {
            'user': request.user
        }

        return render(request, 'unlogin.html', context=context)

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

def account_change_view(request):
    if request.method == 'POST':
        date = request.POST.get('birthday')
        date = datetime.strptime(date, '%d.%m.%Y')

        user = request.user
        user.name = request.POST.get('name')
        user.surname = request.POST.get('surname')
        user.birthday = date
        user.phone = request.POST.get('phone')
        user.email = request.POST.get('email')
        user.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

def account_logout_view(request):
    logout(request)
    return JsonResponse({'success': True})