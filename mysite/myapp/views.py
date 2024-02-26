from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import *

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
    return render(request, 'account.html')

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

def category_catalog(request, category_slug):
    category = Category.objects.get(slug=category_slug)
    subcategories = Subcategory.objects.filter(category=category)

    context = {
        'category': category,
        'subcategories': subcategories
    }

    return render(request, 'category_catalog.html', context=context)