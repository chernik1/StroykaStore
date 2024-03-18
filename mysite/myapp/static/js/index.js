// Каталог
(function() {
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



