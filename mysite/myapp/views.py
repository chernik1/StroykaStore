from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import *

# Create your views here.

def index(request):
    return render(request, 'index.html')

def brands(request):

    brands = Brands.objects.all()
    rus_letters = []
    eng_letters = []

    for brand in brands:
        letter = brand.name[0]
        if letter.upper() in 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ' and letter.upper() not in rus_letters:
            rus_letters.append(letter.upper())
        elif letter.upper() in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' and letter.upper() not in eng_letters:
            eng_letters.append(letter.upper())

    rus_letters.sort()
    eng_letters.sort()

    context = {
        'rus_letters': rus_letters,
        'eng_letters': eng_letters,
        'brands': brands
    }

    return render(request, 'brands.html', context=context)

