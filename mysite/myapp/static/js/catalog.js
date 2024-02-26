const titles = document.querySelectorAll('.catalog__categories-item-title');
const images = document.querySelectorAll('.catalog__categories-img');

titles.forEach((title, index) => {
    if (title.offsetHeight > 40) {
        images[index].style.height = '114px';
    } else {
        images[index].style.height = '140px';
    }
});