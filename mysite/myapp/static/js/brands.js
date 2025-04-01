(function() {
  const buttons = document.querySelectorAll('.popular__questions-item-button');
  const hiddenContents = document.querySelectorAll('.popular__questions-item-unvisible');

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      hiddenContents.forEach((content, i) => {
        if (i !== index) {
          content.classList.add('popular__questions-item-unvisible');
          buttons[i].querySelector('img').style.transform = 'rotate(0deg)';
        }
      });

      hiddenContents[index].classList.toggle('popular__questions-item-unvisible');

      const img = button.querySelector('img');
      if (hiddenContents[index].classList.contains('popular__questions-item-unvisible')) {
        img.style.transform = 'rotate(0deg)';
      } else {
        img.style.transform = 'rotate(180deg)';
      }
    });
  });
})();