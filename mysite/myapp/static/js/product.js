document.addEventListener('DOMContentLoaded', function() {
    const plusButton = document.querySelector('.product-plus');
    const minusButton = document.querySelector('.product-minus');
    const countInput = document.querySelector('.product-count');

    plusButton.addEventListener('click', function() {
        let currentValue = parseInt(countInput.value) || 0;
        if (currentValue < 99) {
            countInput.value = currentValue + 1;
        }
    });

    minusButton.addEventListener('click', function() {
        let currentValue = parseInt(countInput.value) || 0;
        if (currentValue > 1) {
            countInput.value = currentValue - 1;
        }
    });

    countInput.addEventListener('input', function() {
        let currentValue = parseInt(this.value) || 0;
        if (currentValue < 1) {
            this.value = 1;
        } else if (currentValue > 99) {
            this.value = 99;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var descriptionText = document.querySelector('.product__description-text');
    descriptionText.textContent = descriptionText.textContent.trim();
});

$(document).ready(function() {
    $('.product-btn').click(function() {
        var productId = $(this).val();
        var quantity = $(this).closest('.products__buttons').find('.product-count').val();
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
                    swal("Успешно!", "Товар был успешно добавлен в корзину", "success");
                }
            },
            error: function(error) {
                console.log('Error adding product to cart:', error);
            }
        });
    });
});