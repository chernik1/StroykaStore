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