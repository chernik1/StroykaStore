// Ползунок

var range = document.getElementById('slider');
var hiddenInput = document.querySelector('.category__price-range-values');

noUiSlider.create(range, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});

range.noUiSlider.on('update', function (values, handle) {
    hiddenInput.value = values[handle];
});


// Функция для сортировки продуктов
function sortProducts(sortMethod) {
    var productNames = [];
    document.querySelectorAll('.products__products-title').forEach(function(link) {
        productNames.push(link.textContent);
    });

    $.ajax({
        url: '/category_subcategory_sort/',
        type: 'POST',
        data: {
            'sort_method': sortMethod,
            'product_names': productNames
        },
        beforeSend: function(xhr, settings) {
            var csrfToken = $('meta[name="csrf-token"]').attr('content');
            xhr.setRequestHeader('X-CSRFToken', csrfToken);
        },
        success: function(response) {
            var productList = document.querySelector('.products__products-list');
            productList.innerHTML = '';
            response.products.forEach(function(product) {
                var productContainer = document.createElement('li');
                productContainer.classList.add('products__products-item');

                if (product.discount) {
                    var imageDiv = document.createElement('div');
                    imageDiv.classList.add('stocks__pic_and_stock');
                    imageDiv.classList.add('block_bottom_16px');
                    var productImage = document.createElement('img');
                     productImage.src = product.photo;
                     productImage.className = 'product-image';
                    var discount = document.createElement('p');
                    discount.className = 'stock';
                    discount.textContent = product.discount + '%';
                    imageDiv.appendChild(productImage);
                    imageDiv.appendChild(discount);
                    productContainer.appendChild(imageDiv);
                }
                else {
                    var productImage = document.createElement('img');
                    productImage.src = product.photo;
                    productImage.className = 'product-image';
                    productContainer.appendChild(productImage);
                }
                var productText = document.createElement('div');
                productText.classList.add('products__products-text');
                var productName = document.createElement('a');
                productName.classList.add('products__products-title');
                productName.href = '/catalog/' + response.category + '/' + product.subcategory + '/' + product.name + '/';
                productName.textContent = product.name;
                if (product.discount) {
                    var newPrice = document.createElement('p');
                    newPrice.classList.add('product__new-price');
                    newPrice.textContent = product.new_price + ' ₽';
                    var oldPrice = document.createElement('p');
                    oldPrice.classList.add('product__old-price');
                    oldPrice.textContent = product.price + ' ₽';
                    productText.appendChild(productName);
                    productText.appendChild(newPrice);
                    productText.appendChild(oldPrice);
                }
                else {
                    var productPrice = document.createElement('p');
                    productPrice.classList.add('products__products-price');
                    productPrice.textContent = product.price + ' ₽';
                    productText.appendChild(productName);
                    productText.appendChild(productPrice);
                }

                buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('button-block');
                var basketBtn = document.createElement('button');
                basketBtn.classList.add('products__products-btn');
                basketBtn.classList.add('basket-click');
                basketBtn.value = product.id;
                var basketBtnText = document.createElement('p');
                basketBtnText.classList.add('products__products-btn-text');
                basketBtnText.textContent = 'В корзину';
                basketBtn.appendChild(basketBtnText);

                var quantityDiv = document.createElement('div');
                quantityDiv.classList.add('basket__quantity');
                var plusBtn = document.createElement('button');
                plusBtn.classList.add('basket__plus');
                plusBtn.textContent = '+';
                var input = document.createElement('input');
                input.classList.add('basket__input');
                input.type = 'number';
                input.value = 1;
                input.min = 1;
                var minusBtn = document.createElement('button');
                minusBtn.classList.add('basket__minus');
                minusBtn.textContent = '-';
                quantityDiv.appendChild(plusBtn);
                quantityDiv.appendChild(input);
                quantityDiv.appendChild(minusBtn);
                buttonsDiv.appendChild(basketBtn);
                buttonsDiv.appendChild(quantityDiv);
                productText.appendChild(buttonsDiv);

                productContainer.appendChild(productText);


                productList.appendChild(productContainer);
            });
        },
        error: function(error) {
            console.error('Ошибка сортировки продуктов:', error);
        }
    });
}

document.querySelectorAll('.products__sort-link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        var sortMethod = this.getAttribute('data-method');
        sortProducts(sortMethod);
    });
});