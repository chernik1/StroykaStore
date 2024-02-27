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
