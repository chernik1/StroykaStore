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
                    countElement.textContent = data.count + ' шт.';
                    priceElement.textContent = data.total_price + ' ₽';
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


