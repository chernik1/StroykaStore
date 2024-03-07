document.addEventListener('DOMContentLoaded', function() {
  const plusButtons = document.querySelectorAll('.basket__products_plus');
  const minusButtons = document.querySelectorAll('.basket__products_minus');
  const quantityInputs = document.querySelectorAll('.basket__products_input');
  const totalElement = document.querySelector('.basket__form-price-value');
  const maxQuantity = 99;

  function updateTotalPrice() {
    let totalPrice = 0;

    document.querySelectorAll('.basket__products-item').forEach(item => {
      const price = parseFloat(item.querySelector('.basket__products-price').textContent.replace(/[^\d.-]/g, ''));
      const quantity = parseInt(item.querySelector('.basket__products_input').value, 10);
      totalPrice += price * quantity;
    });

    totalElement.textContent = `${totalPrice} ₽`;
  }

  function adjustQuantity(input, delta) {
    let quantity = parseInt(input.value, 10) + delta;
    quantity = Math.max(quantity, 1);
    quantity = Math.min(quantity, maxQuantity);
    input.value = quantity;
    updateTotalPrice();
  }

  plusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.closest('.basket__products_quantity').querySelector('.basket__products_input');
      adjustQuantity(input, 1);
    });
  });

  minusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.closest('.basket__products_quantity').querySelector('.basket__products_input');
      adjustQuantity(input, -1);
    });
  });

  quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
      let quantity = parseInt(input.value, 10);
      input.value = Math.max(1, Math.min(quantity, maxQuantity));
      updateTotalPrice();
    });
  });

  updateTotalPrice();
});

const productList = document.querySelector('.basket__products-list');
const countElement = document.querySelector('.basket__form-count-value');
const priceElement = document.querySelector('.basket__form-price-value');
var csrfToken = $('meta[name="csrf-token"]').attr('content');

productList.addEventListener('click', function(event) {
    if (event.target.matches('.basket__products-btn') || event.target.matches('.basket__products-btn-text')) {
        const productItem = event.target.closest('.basket__products-item');
        const productIndex = Array.from(productList.children).indexOf(productItem);


        $.ajax({
            url: '/basket/delete/',
            type: 'POST',
            data: JSON.stringify({'product_index': productIndex}),
            contentType: 'application/json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrfToken);
            },
            success: function(data) {
                if (data.success) {
                    productItem.remove();
                    countElement.textContent = data.count;
                    priceElement.textContent = data.total_price;
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
});

// Modal window

const paymentModal = document.getElementById('modal__window_pay');
const openButton = document.getElementById('basket__form-btn');

openButton.addEventListener('click', () => {
  paymentModal.style.display = 'block';
});

const closeButton = document.querySelector('.modal__window_pay_close-button');
closeButton.addEventListener('click', () => {
  paymentModal.style.display = 'none';
});

var stripe = Stripe('pk_test_51OriUYG6Pu3iSEbBappeeOqWruHA5sIP2YeJUVncKeD4sn68jq35qnnCTUpFsNfLA52mJCtgyvqIW4zVWDn3qVO700pzNEdsXj');

var elements = stripe.elements();

var card = elements.create('card');
card.mount('#card-element');

$('.modal__window_pay-btn').on('click', function(e) {
    e.preventDefault();
    stripe.createToken(card).then(function(result) {
        if (result.error) {
            console.error(result.error.message);
        } else {
            var token = result.token.id;

            const price_all = $('.basket__form-price-value').val();
            const supplier = $('.basket__form-supplier-value').val();
            const quantity = $('.basket__form-count-value').val();
            const products = document.querySelectorAll('.basket__products-item');
            const dataProduct = [];

            products.forEach(product => {
                var name = product.querySelector('.basket__products-title').textContent.trim();
                var price = product.querySelector('.basket__products-price').textContent.trim();
                var code = product.querySelector('.basket__products-code').textContent.trim();

                dataProduct.push({ name, price, code });
            });

            $.post('/basket/payment/', {
                stripeToken: token,
                products: JSON.stringify(dataProduct),
                price_all: price_all,
                supplier: supplier,
                quantity: quantity,
                csrfmiddlewaretoken: csrfToken
            })
            .done(function(data) {
                console.log(data);
            })
            .fail(function(xhr, status, error) {
                console.error('Error:', error);
            });
        }
    });
});
