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

function openModal() {
  let btn = document.querySelector(".header__location_button");
  let modal = document.querySelector("#modal__window_city");
  let overlay = document.querySelector(".modal__window");
  let cityNameSpan = document.getElementById("city-name");

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
    });
  }
}





