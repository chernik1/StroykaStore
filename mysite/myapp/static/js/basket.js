document.addEventListener('DOMContentLoaded', function() {
  const plusButtons = document.querySelectorAll('.basket__products_plus');
  const minusButtons = document.querySelectorAll('.basket__products_minus');
  const quantityInputs = document.querySelectorAll('.basket__products_input');
  const totalElement = document.querySelector('.basket__form-price-value');

  function updateTotalPrice() {
    let totalPrice = 0;

    document.querySelectorAll('.basket__products-item').forEach(item => {
      const price = parseFloat(item.querySelector('.basket__products-price').textContent.replace(/[^\d.-]/g, ''));
      const quantity = parseInt(item.querySelector('.basket__products_input').value, 10);
      totalPrice += price * quantity;
    });

    totalElement.textContent = `${totalPrice} ₽`;
  }

  plusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.closest('.basket__products_quantity').querySelector('.basket__products_input');
      input.value = parseInt(input.value, 10) + 1;
      updateTotalPrice();
    });
  });

  minusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.closest('.basket__products_quantity').querySelector('.basket__products_input');
      input.value = Math.max(parseInt(input.value, 10) - 1, 1);
      updateTotalPrice();
    });
  });

  quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
      input.value = Math.max(parseInt(input.value, 10), 1); // Обеспечиваем, что количество не меньше 1
      updateTotalPrice();
    });
  });

  updateTotalPrice(); // Инициализация общей суммы при загрузке страницы
});