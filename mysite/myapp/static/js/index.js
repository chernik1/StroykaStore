// Каталог
(function updateCatalogBehavior() {
  let catalogLink = document.querySelector(".header__catalog-link");
  let catalogLogo = document.querySelector(".header__catalog-logo");

  catalogLink.addEventListener("mouseover", function() {
    catalogLogo.src = "/static/img/svg/catalog-icon-white.svg";
  });

  catalogLink.addEventListener("mouseout", function() {
    catalogLogo.src = "/static/img/svg/icon-catalog.svg";
  });

  catalogLink.addEventListener("click", function() {
    catalogLogo.src = "/static/img/svg/catalog-icon-grey.svg";
  });
})();

// Фиксированная шапка
(function fixedHeader() {
    window.addEventListener('scroll', function() {
    const mainTools = document.querySelector('.main__tools');
    if (window.scrollY > 100) {
        mainTools.style.position = 'fixed';
        mainTools.style.top = '0';
        mainTools.style.left = '0';
        mainTools.style.right = '0';
        mainTools.maxWidth = '2040px';
    } else {
        mainTools.style.position = 'static';
    }
});
})();

// Модальное окно
function openModal() {
  let btn = document.querySelector(".header__location_button");
  let modal = document.querySelector("#modal__window_city");
  let overlay = document.querySelector(".modal__window");
  let cityNameSpan = document.getElementById("city-name");

  const storedCity = localStorage.getItem('selectedCity');
  if (storedCity) {
    cityNameSpan.textContent = storedCity;
  }

  btn.addEventListener("click", function() {
    modal.classList.add("modal-open");
    overlay.classList.add("modal-open");
  });

  let closeButton = document.querySelector(".modal__window-close");
  closeButton.addEventListener("click", function() {
    modal.classList.remove("modal-open");
    overlay.classList.remove("modal-open");
  });

  let modalLinks = document.querySelectorAll(".modal__window-link");
  for (let link of modalLinks) {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      let city = link.textContent.trim();
      closeButton.click();
      cityNameSpan.textContent = city;
      localStorage.setItem('selectedCity', city);
    });
  }
}

// Специальные предложения
(function() {
    const offerLink = "#offer";
    const saleLink = "#sale";

    const tabBackground = document.querySelector('.main__tab-background');
    const tabTitle = document.querySelector('.main__tab_title');
    const tabDescription = document.querySelector('.main__tab_description');
    const leftArrow = document.getElementById('main__tab-left-arrow');
    const rightArrow = document.getElementById('main__tab-right-arrow');
    const detailsButton = document.getElementById("main__tab-details");

    function changeBackgroundImage(imageUrl, title, description) {
        tabBackground.style.backgroundImage = `url("${imageUrl}")`;
        tabTitle.textContent = title;
        tabDescription.textContent = description;
    }

    function changeLink(link) {
        detailsButton.querySelector(".main__tab-link").href = link;
    }

    leftArrow.addEventListener('click', function() {
        changeBackgroundImage("/static/img/main-tab-1.png", "Специальные предложения", "на строительные материалы и товары для ремонта");
        changeLink(offerLink);
    });

    rightArrow.addEventListener('click', function() {
        changeBackgroundImage("/static/img/main-tab-2.png", "Распродажа инструментов", "«СтройкаСтор» стремится сделать условия покупки максимально выгодными для каждого покупателя, поэтому на сайте регулярно появляются товары со скидкой");
        changeLink(saleLink);
    });
})();



// Корзина
(function() {
  const baskets = document.querySelectorAll(".basket-click");
  const quantities = document.querySelectorAll(".basket__quantity");
  const minuses = document.querySelectorAll(".basket__minus");
  const pluses = document.querySelectorAll(".basket__plus");
  const inputs = document.querySelectorAll(".basket__input");

  baskets.forEach((basket, index) => {
    basket.addEventListener("click", function () {
      basket.style.visibility = "hidden";
      quantities[index].style.visibility = "visible";
    });

    minuses[index].addEventListener("click", function () {
      let value = parseInt(inputs[index].value);
      if (value > 1) {
        value--;
        inputs[index].value = value;
      }
    });

    pluses[index].addEventListener("click", function () {
      let value = parseInt(inputs[index].value);
      value++;
      inputs[index].value = value;
    });

    function returnBasketVisibility() {
      basket.style.visibility = "visible";
      quantities[index].style.visibility = "hidden";
    }

    inputs[index].addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        returnBasketVisibility();
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

(function () {

  const smoothScroll = function (targetEl, duration) {
      let target = document.querySelector(targetEl);
      let targetPosition = target.getBoundingClientRect().top - 200;
      let startPosition = window.pageYOffset;
      let startTime = null;

      const ease = function(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
      };

      const animation = function(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = ease(timeElapsed, startPosition, targetPosition, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
      };
      requestAnimationFrame(animation);
  };

  const scrollTo = function () {
      const links = document.querySelectorAll('.js-scroll');
      links.forEach(each => {
          each.addEventListener('click', function (e) {
              e.preventDefault();
              const currentTarget = this.getAttribute('href');
              smoothScroll(currentTarget, 1000);
          });
      });
  };
  scrollTo();
}());