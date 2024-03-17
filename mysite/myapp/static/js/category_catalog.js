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
                    productImage.style.marginBottom = '16px';
                    productContainer.appendChild(productImage);
                }
                var productText = document.createElement('div');
                productText.classList.add('products__products-text');
                var productName = document.createElement('a');
                productName.classList.add('products__products-title');
                productName.href = '/catalog/' + response.category + '/' + product.subcategory + '/' + product.name + '/';
                productName.textContent = product.name;
                if (product.discount) {
                    priceDiv = document.createElement('div');
                    priceDiv.classList.add('block-price');
                    var newPrice = document.createElement('p');
                    newPrice.classList.add('product__new-price');
                    newPrice.textContent = product.new_price + ' ₽';
                    var oldPrice = document.createElement('p');
                    oldPrice.classList.add('product__old-price');
                    oldPrice.textContent = product.price + ' ₽';
                    productText.appendChild(productName);
                    priceDiv.appendChild(newPrice);
                    priceDiv.appendChild(oldPrice);
                    productText.appendChild(priceDiv);
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
                (function() {

                      function addProductToBasket(productId, quantity) {
                        var csrfToken = $('meta[name="csrf-token"]').attr('content');

                        $.ajax({
                          url: '/basket/add/',
                          type: 'POST',
                          data: {
                            'product_id': productId,
                            'quantity': quantity
                          },
                          beforeSend: function(xhr) {
                            xhr.setRequestHeader('X-CSRFToken', csrfToken);
                          },
                          success: function(response) {
                            if (response.success === true) {
                              swal("Успешно!", "Заказ был успешно добавлен", "success");
                            }
                          },
                          error: function(error) {
                            console.log('Error adding product to cart:', error);
                          }
                        });
                      }

                        var baskets = document.querySelectorAll(".basket-click");
                        var quantities = document.querySelectorAll(".basket__quantity");
                        var minuses = document.querySelectorAll(".basket__minus");
                        var pluses = document.querySelectorAll(".basket__plus");
                        var inputs = document.querySelectorAll(".basket__input");


                      baskets.forEach((basket, index) => {
                        basket.addEventListener("click", function () {
                            basket.style.visibility = "hidden";
                            quantities[index].style.visibility = "visible";
                            inputs[index].focus();
                        });

                        const productId = basket.value;

                        minuses[index].addEventListener("click", function () {
                          let value = parseInt(inputs[index].value);
                          if (value > 1) {
                            value--;
                            inputs[index].value = value;
                          }
                        });

                        pluses[index].addEventListener("click", function () {
                          let value = parseInt(inputs[index].value);
                          if (value < 99) {
                            value++;
                            inputs[index].value = value;
                          }
                        });

                        inputs[index].addEventListener("change", function () {
                          let value = parseInt(inputs[index].value);
                          if (!isNaN(value)) {
                            inputs[index].value = Math.min(value, 99);
                          }
                        });

                        function returnBasketVisibility() {
                          const quantity = parseInt(inputs[index].value);
                          addProductToBasket(productId, Math.min(quantity, 99));
                          basket.style.visibility = "visible";
                          quantities[index].style.visibility = "hidden";
                        }

                        inputs[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            let value = parseInt(inputs[index].value);
                            if (!isNaN(value)) {
                              inputs[index].value = Math.min(value, 99);
                              returnBasketVisibility();
                              event.preventDefault();
                            }
                          }
                        });

                        minuses[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            returnBasketVisibility();
                          }
                        });

                        pluses[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            returnBasketVisibility();
                          }
                        });

                        minuses[index].addEventListener("keydown", function(event) {
                          if (event.key === "Enter") {
                            event.preventDefault();
                          }
                        });

                        pluses[index].addEventListener("keydown", function(event) {
                          if (event.key === "Enter") {
                            event.preventDefault();
                          }
                        });
                      });
                    })();
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

// Ползунок

var range = document.getElementById('slider');
var fromInput = document.querySelector('.category__price-input-from');
var toInput = document.querySelector('.category__price-input-to');

var initialRangeValues = [100, 1000];

noUiSlider.create(range, {
    start: initialRangeValues,
    connect: true,
    range: {
        'min': 100,
        'max': 10000
    }
});

range.noUiSlider.on('update', function (values, handle) {
    if (handle === 0) {
        fromInput.value = Math.round(values[handle]).toLocaleString();
    } else {
        toInput.value = Math.round(values[handle]).toLocaleString();
    }
});

// Применить

$('.category__buttons-apply').on('click', function() {
    var checkedBrands = [];
    $('.category__brand-checkbox:checked').each(function() {
        checkedBrands.push($(this).siblings('.category__brand-item-text').text());
    });

    var fromValue = $('.category__price-input-from').val();
    var toValue = $('.category__price-input-to').val();

    var categoryElement = document.querySelector('.category-title');
    var categoryValue = categoryElement.getAttribute('data-category');

    $.ajax({
        url: '/category_subcategory_apply/',
        type: 'POST',
        data: {
            'checked_brands': checkedBrands,
            'from_value': fromValue,
            'to_value': toValue,
            'category': categoryValue
        },
        beforeSend: function(xhr) {
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
                    productImage.style.marginBottom = '16px';
                    productContainer.appendChild(productImage);
                }
                var productText = document.createElement('div');
                productText.classList.add('products__products-text');
                var productName = document.createElement('a');
                productName.classList.add('products__products-title');
                productName.href = '/catalog/' + response.category + '/' + product.subcategory + '/' + product.name + '/';
                productName.textContent = product.name;
                if (product.discount) {
                    priceDiv = document.createElement('div');
                    priceDiv.classList.add('block-price');
                    var newPrice = document.createElement('p');
                    newPrice.classList.add('product__new-price');
                    newPrice.textContent = product.new_price + ' ₽';
                    var oldPrice = document.createElement('p');
                    oldPrice.classList.add('product__old-price');
                    oldPrice.textContent = product.price + ' ₽';
                    productText.appendChild(productName);
                    priceDiv.appendChild(newPrice);
                    priceDiv.appendChild(oldPrice);
                    productText.appendChild(priceDiv);
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
                (function() {

                      function addProductToBasket(productId, quantity) {
                        var csrfToken = $('meta[name="csrf-token"]').attr('content');

                        $.ajax({
                          url: '/basket/add/',
                          type: 'POST',
                          data: {
                            'product_id': productId,
                            'quantity': quantity
                          },
                          beforeSend: function(xhr) {
                            xhr.setRequestHeader('X-CSRFToken', csrfToken);
                          },
                          success: function(response) {
                            if (response.success === true) {
                              swal("Успешно!", "Заказ был успешно добавлен", "success");
                            }
                          },
                          error: function(error) {
                            console.log('Error adding product to cart:', error);
                          }
                        });
                      }

                        var baskets = document.querySelectorAll(".basket-click");
                        var quantities = document.querySelectorAll(".basket__quantity");
                        var minuses = document.querySelectorAll(".basket__minus");
                        var pluses = document.querySelectorAll(".basket__plus");
                        var inputs = document.querySelectorAll(".basket__input");


                      baskets.forEach((basket, index) => {
                        basket.addEventListener("click", function () {
                            basket.style.visibility = "hidden";
                            quantities[index].style.visibility = "visible";
                            inputs[index].focus();
                        });

                        const productId = basket.value;

                        minuses[index].addEventListener("click", function () {
                          let value = parseInt(inputs[index].value);
                          if (value > 1) {
                            value--;
                            inputs[index].value = value;
                          }
                        });

                        pluses[index].addEventListener("click", function () {
                          let value = parseInt(inputs[index].value);
                          if (value < 99) {
                            value++;
                            inputs[index].value = value;
                          }
                        });

                        inputs[index].addEventListener("change", function () {
                          let value = parseInt(inputs[index].value);
                          if (!isNaN(value)) {
                            inputs[index].value = Math.min(value, 99);
                          }
                        });

                        function returnBasketVisibility() {
                          const quantity = parseInt(inputs[index].value);
                          addProductToBasket(productId, Math.min(quantity, 99));
                          basket.style.visibility = "visible";
                          quantities[index].style.visibility = "hidden";
                        }

                        inputs[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            let value = parseInt(inputs[index].value);
                            if (!isNaN(value)) {
                              inputs[index].value = Math.min(value, 99);
                              returnBasketVisibility();
                              event.preventDefault();
                            }
                          }
                        });

                        minuses[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            returnBasketVisibility();
                          }
                        });

                        pluses[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            returnBasketVisibility();
                          }
                        });

                        minuses[index].addEventListener("keydown", function(event) {
                          if (event.key === "Enter") {
                            event.preventDefault();
                          }
                        });

                        pluses[index].addEventListener("keydown", function(event) {
                          if (event.key === "Enter") {
                            event.preventDefault();
                          }
                        });
                      });
                    })();
            });
        },
        error: function(error) {
            console.log('Error:', error);
        }
    });
});

// Сбросить

document.querySelector('.category__buttons-reset').addEventListener('click', function() {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    var categoryElement = document.querySelector('.category-title');
    var categoryValue = categoryElement.getAttribute('data-category');
  $.ajax({
    url: '/category_subcategory_reset/',
    type: 'POST',
      data: {
        'category': categoryValue
      },
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-CSRFToken', csrfToken);
    },
    success: function(response) {
      if (response.success === true) {
        document.querySelectorAll('.category__brand-checkbox').forEach(function(checkbox) {
          checkbox.checked = false;
        });

        range.noUiSlider.set(initialRangeValues);
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
                    productImage.style.marginBottom = '16px';
                    productContainer.appendChild(productImage);
                }
                var productText = document.createElement('div');
                productText.classList.add('products__products-text');
                var productName = document.createElement('a');
                productName.classList.add('products__products-title');
                productName.href = '/catalog/' + response.category + '/' + product.subcategory + '/' + product.name + '/';
                productName.textContent = product.name;
                if (product.discount) {
                    priceDiv = document.createElement('div');
                    priceDiv.classList.add('block-price');
                    var newPrice = document.createElement('p');
                    newPrice.classList.add('product__new-price');
                    newPrice.textContent = product.new_price + ' ₽';
                    var oldPrice = document.createElement('p');
                    oldPrice.classList.add('product__old-price');
                    oldPrice.textContent = product.price + ' ₽';
                    productText.appendChild(productName);
                    priceDiv.appendChild(newPrice);
                    priceDiv.appendChild(oldPrice);
                    productText.appendChild(priceDiv);
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
                (function() {

                      function addProductToBasket(productId, quantity) {
                        var csrfToken = $('meta[name="csrf-token"]').attr('content');

                        $.ajax({
                          url: '/basket/add/',
                          type: 'POST',
                          data: {
                            'product_id': productId,
                            'quantity': quantity
                          },
                          beforeSend: function(xhr) {
                            xhr.setRequestHeader('X-CSRFToken', csrfToken);
                          },
                          success: function(response) {
                            if (response.success === true) {
                              swal("Успешно!", "Заказ был успешно добавлен", "success");
                            }
                          },
                          error: function(error) {
                            console.log('Error adding product to cart:', error);
                          }
                        });
                      }

                        var baskets = document.querySelectorAll(".basket-click");
                        var quantities = document.querySelectorAll(".basket__quantity");
                        var minuses = document.querySelectorAll(".basket__minus");
                        var pluses = document.querySelectorAll(".basket__plus");
                        var inputs = document.querySelectorAll(".basket__input");


                      baskets.forEach((basket, index) => {
                        basket.addEventListener("click", function () {
                            basket.style.visibility = "hidden";
                            quantities[index].style.visibility = "visible";
                            inputs[index].focus();
                        });

                        const productId = basket.value;

                        minuses[index].addEventListener("click", function () {
                          let value = parseInt(inputs[index].value);
                          if (value > 1) {
                            value--;
                            inputs[index].value = value;
                          }
                        });

                        pluses[index].addEventListener("click", function () {
                          let value = parseInt(inputs[index].value);
                          if (value < 99) {
                            value++;
                            inputs[index].value = value;
                          }
                        });

                        inputs[index].addEventListener("change", function () {
                          let value = parseInt(inputs[index].value);
                          if (!isNaN(value)) {
                            inputs[index].value = Math.min(value, 99);
                          }
                        });

                        function returnBasketVisibility() {
                          const quantity = parseInt(inputs[index].value);
                          addProductToBasket(productId, Math.min(quantity, 99));
                          basket.style.visibility = "visible";
                          quantities[index].style.visibility = "hidden";
                        }

                        inputs[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            let value = parseInt(inputs[index].value);
                            if (!isNaN(value)) {
                              inputs[index].value = Math.min(value, 99);
                              returnBasketVisibility();
                              event.preventDefault();
                            }
                          }
                        });

                        minuses[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            returnBasketVisibility();
                          }
                        });

                        pluses[index].addEventListener("keyup", function(event) {
                          if (event.key === "Enter") {
                            returnBasketVisibility();
                          }
                        });

                        minuses[index].addEventListener("keydown", function(event) {
                          if (event.key === "Enter") {
                            event.preventDefault();
                          }
                        });

                        pluses[index].addEventListener("keydown", function(event) {
                          if (event.key === "Enter") {
                            event.preventDefault();
                          }
                        });
                      });
                    })();
            });
      }
    },
    error: function(error) {
      console.log('Error:', error);
    }
  });

});