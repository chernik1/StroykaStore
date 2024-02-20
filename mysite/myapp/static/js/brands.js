(function() {
  const buttons = document.querySelectorAll('.popular__questions-item-button');
  const hiddenContents = document.querySelectorAll('.popular__questions-item-unvisible');

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      hiddenContents.forEach((content, i) => {
        if (i !== index) {
          content.classList.add('hidden');
          buttons[i].querySelector('img').src = '/static/img/brands/svg/question-icon-close.svg';
        }
      });
      hiddenContents[index].classList.toggle('popular__questions-item-unvisible');
      if (hiddenContents[index].classList.contains('popular__questions-item-unvisible')) {
        button.querySelector('img').src = '/static/img/brands/svg/question-icon-close.svg';
      } else {
        button.querySelector('img').src = '/static/img/brands/svg/question-icon-open.svg';
      }
    });
  });
})();
