from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.http import require_POST
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from .models import *
from django.db.utils import IntegrityError
from datetime import datetime
from django.conf import settings
import webbrowser
from django.views.decorators.csrf import csrf_exempt
import yookassa as yo
from django.urls import reverse
import decimal
from django.forms.models import model_to_dict

# Create your views here.

from django.template.defaultfilters import stringfilter
from urllib.parse import unquote, quote

@stringfilter
def unquote_raw(value):
    return unquote(value)

def index(request):
    products = Product.objects.all()
    popular_products = []
    stock_products = []

    for product in products:
        if product.discount:
            product.new_price = int(product.price -(product.price * (product.discount / 100)))
            stock_products.append(product)
        if len(popular_products) == 4:
            break

    if len(products) > 12:
        for i in range(12):
            product = products[i]
            if not product.discount and product.discount is not None:
                product.new_price = int(product.price - (product.price * (product.discount / 100)))
            popular_products.append(product)
    else:
        popular_products = products

    context = {
        'user': request.user,
        'popular_products': popular_products,
        'stock_products': stock_products,
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
    category = unquote(category)
    subcategory = unquote(subcategory)
    new_products = []
    for product in products:
        if not product.discount is None:
            product.new_price = int(product.price - (product.price * (product.discount / 100)))
        new_products.append(product)

    brands = list(set(product.brand for product in products))
    suppliers = list(set(product.supplier for product in products))

    context = {
        'categories': categories,
        'subcategories': subcategories,
        'products': new_products,
        'category': category,
        'subcategory': subcategory,
        'brands': brands,
        'suppliers': suppliers,
        'user': request.user
    }

    return render(request, 'category_catalog.html', context=context)

def category_subcategory_sort(request):
    if request.method == 'POST':
        products = request.POST.getlist('product_names[]')
        method = request.POST.get('sort_method')

        products_list = [Product.objects.get(name=product) for product in products]

        if products_list:
            subcategory = products_list[0].subcategory
            category = subcategory.category.name
        else:
            category = ''

        for product in products_list:
            if not product.discount is None:
                product.new_price = int(product.price - (product.price * (product.discount / 100)))

        if method == 'expensive':
            products_list = sorted(products_list, key=lambda product: product.price, reverse=True)
        elif method == 'cheap':
            products_list = sorted(products_list, key=lambda product: product.price)
        elif method == 'alphabet':
            products_list = sorted(products_list, key=lambda product: product.name)
        elif method == 'popular':
            products_list = sorted(products_list, key=lambda product: product.view, reverse=True)

        products_list_new = []
        for product in products_list:
            product_dict = model_to_dict(product)
            if product.photo:
                product_dict['photo'] = product.photo.url
            else:
                product_dict['photo'] = None
            product_dict['subcategory'] = product.subcategory.name
            products_list_new.append(product_dict)

        return JsonResponse({'success': True, 'products': products_list_new, 'category': category})

def category_subcategory_apply(request):
    if request.method == 'POST':
        list_brands = request.POST.getlist('checked_brands[]')
        from_value_str = request.POST.get('from_value')
        to_value_str = request.POST.get('to_value')
        category = request.POST.get('category')

        if not from_value_str is None and not to_value_str is None:
            from_value = int(from_value_str.replace('\xa0', ''))
            to_value = int(to_value_str.replace('\xa0', ''))
        else:
            return JsonResponse({'success': False, 'message': 'Необходимо ввести диапазон цен'})
        products_list = Product.objects.all()

        for product in products_list:
            if not product.discount is None:
                product.new_price = int(product.price - (product.price * (product.discount / 100)))

        for product in products_list:
            if product.discount is None:
                if product.price < from_value:
                    products_list = products_list.exclude(name=product.name)
                elif product.price > to_value:
                    products_list = products_list.exclude(name=product.name)
            else:
                if product.new_price < from_value:
                    products_list = products_list.exclude(name=product.name)
                elif product.new_price > to_value:
                    products_list = products_list.exclude(name=product.name)

        products_list_clear = []

        for product in products_list:
            if product.brand.name in list_brands and product.subcategory.category.name == category:
                products_list_clear.append(product)

        if products_list_clear:
            subcategory = products_list[0].subcategory
            category = subcategory.category.name
        else:
            category = ''

        products_list_new = []
        for product in products_list_clear:
            product_dict = model_to_dict(product)
            if product.photo:
                product_dict['photo'] = product.photo.url
            else:
                product_dict['photo'] = None
            product_dict['subcategory'] = product.subcategory.name
            products_list_new.append(product_dict)

        return JsonResponse({'success': True, 'products': products_list_new, 'category': category})

def category_subcategory_reset(request):
    if request.method == 'POST':
        category = request.POST.get('category')
        products = Product.objects.all().filter(subcategory__category__name=category)

        for product in products:
            if not product.discount is None:
                product.new_price = int(product.price - (product.price * (product.discount / 100)))

        products_list_new = []
        for product in products:
            product_dict = model_to_dict(product)
            if product.photo:
                product_dict['photo'] = product.photo.url
            else:
                product_dict['photo'] = None
            product_dict['subcategory'] = product.subcategory.name
            products_list_new.append(product_dict)

        return JsonResponse({'success': True, 'products': products_list_new, 'category': category})

def product_view(request, category: str, subcategory: str, product: str):
    product = Product.objects.get(name=product)
    supplier = product.supplier
    category = Category.objects.get(name=category)

    product.view += 1
    product.save()

    if not product.discount is None:
        product.new_price = int(product.price - (product.price * (product.discount / 100)))

    context = {
        'product': product,
        'supplier': supplier,
        'category': category,
        'user': request.user
    }

    return render(request, 'product.html', context=context)

def basket_view(request):
    if request.user.is_authenticated:
        basket_json = request.user.basket_items

        sum_orders = 0
        count_orders = 0
        orders = []

        if basket_json is None:

            context = {
                'user': request.user
            }

            return render(request, 'basket.html', context=context)

        for item in basket_json:
            product = Product.objects.get(id=item['product_id'])
            price = product.price
            sum_orders += price * int(item['quantity'])
            count_orders += 1

            if not product.discount is None:
                product.new_price = int(product.price - (product.price * (product.discount / 100)))
            orders.append(
                {
                    'product': product,
                    'quantity': item['quantity']
                }
            )

        if request.user.basket_supplier is None:
            supplier = ''
        else:
            supplier = request.user.basket_supplier

        context = {
            'user': request.user,
            'orders': orders,
            'sum_orders': str(int(sum_orders)),
            'count_orders': count_orders,
            'supplier': supplier
        }

        return render(request, 'basket.html', context=context)
    else:
        context = {
            'user': request.user
        }
        return render(request, 'unlogin.html', context=context)

def orders_view(request):
    if request.user.is_authenticated:

        payments = Payment.objects.all().filter(user=request.user)
        products = []
        final_products = []

        for payment in payments:
            for product in payment.products:
                pr = Product.objects.get(id=product['id'])
                if not pr.discount is None:
                    pr.new_price = int(pr.price - (pr.price * (pr.discount / 100)))

                final_products.append({
                    'product': pr,
                    'quantity': product['quantity'],
                    'price': pr.new_price,
                    'old_price': pr.price,
                    'date': payment.date.strftime('%d.%m.%Y'),
                    'status': payment.status,
                    'id': payment.id,
                })

        context = {
            'user': request.user,
            'products': final_products
        }

        return render(request, 'orders.html', context=context)
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

def basket_add(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = request.POST.get('quantity')
        product = Product.objects.get(id=product_id)
        supplier_name = product.supplier.name

        if request.user.basket_supplier == supplier_name or request.user.basket_supplier is None:
            new_product_item = {"product_id": product_id, "quantity": quantity}
            request.user.basket_supplier = supplier_name
            if request.user.basket_items is None:
                request.user.basket_items = [new_product_item]
            else:
                request.user.basket_items = request.user.basket_items + [new_product_item]
            request.user.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False})

def basket_delete(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        product_index = data['product_index']

        request.user.basket_items.pop(product_index)

        if request.user.basket_items == []:
            request.user.basket_supplier = None

        request.user.save()

        total_price = 0
        count = 0
        for item in request.user.basket_items:
            count += 1
            product = Product.objects.get(id=item['product_id'])
            price = product.price
            total_price += price * int(item['quantity'])

        return JsonResponse({'success': True, 'total_price': total_price, 'count': count})

def basket_payment(request):
    data = json.loads(request.body)
    products = data['products']
    amount = data['amount']

    status = 'Не оплачен'

    buffer = Payment.objects.create(
        user=request.user,
        amount=amount,
        status=status,
        products=products,
    )

    id = buffer.id

    try:
        yo.Configuration.account_id = settings.YOOKASSA_SHOP_ID
        yo.Configuration.secret_key = settings.YOOKASSA_SECRET_KEY
        payment = yo.Payment.create({
            "amount": {
                "value": amount,
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": f"http://127.0.0.1:8000/basket/payment/success/{id}",
            },
            "capture": True,
            "description": "Заказ №1"
        }, str(uuid.uuid4()))
        url = payment.confirmation.confirmation_url
        return JsonResponse({'url': url, 'success': True})
    except Exception as e:
        buffer.delete()
        buffer.save()
        return JsonResponse({'success': False})

def basket_payment_success(request, order_id):
    id = order_id
    payment = Payment.objects.get(id=id)
    payment.status = 'Оплачен'
    payment.save()

    user = request.user
    user.basket_items = []
    user.basket_supplier = None
    user.save()

    return render(request, 'basket_payment_success.html')