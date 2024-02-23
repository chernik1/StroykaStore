from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import *

# Create your views here.

def index(request):
    return render(request, 'index.html')

def brands(request):

    brands = Brands.objects.all()
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