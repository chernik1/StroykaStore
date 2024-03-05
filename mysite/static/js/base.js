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

// Прокрутка
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

// Модальное окно городов
function openModal() {
  let btn = document.querySelector(".header__location_button");
  let modal = document.querySelector("#modal__window_city");
  let overlay = document.querySelector(".modal__window_city");
  let cityNameSpan = document.getElementById("city-name");

  const storedCity = localStorage.getItem('selectedCity');
  if (storedCity) {
    cityNameSpan.textContent = storedCity;
  }

  btn.addEventListener("click", function() {
    modal.classList.add("modal-open");
    overlay.classList.add("modal-open");
  });

  let closeButton = document.querySelector(".modal__window_city-close");
  closeButton.addEventListener("click", function() {
    modal.classList.remove("modal-open");
    overlay.classList.remove("modal-open");
  });

  let modalLinks = document.querySelectorAll(".modal__window_city-link");
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

// Модальное окно профиля

$(document).ready(function(){{
        $(".header__card-pic_profile").on("click", function(e) {
            if (isUserAuthenticated) {
                window.location.href = '/account';
            }
            else {
                e.preventDefault();
                $("#modal__window_profile").css("display", "block");
            }
        });
        $(".modal__window_profile-close").on("click", function() {
            $("#modal__window_profile").css("display", "none");
        });
        $(".modal__window_profile-login").on("click", function() {
            $("#modal__window_login").css("display", "block");
            $("#modal__window_profile").css("display", "none");
        });
        $(".modal__window_profile-register").on("click", function() {
            $("#modal__window_register").css("display", "block");
            $("#modal__window_profile").css("display", "none");
        });
    }
});

// Модальное окно входа

$(".modal__window_login-close").on("click", function() {
    $("#modal__window_login").css("display", "none");
});

// Модальное окно регистрации

$(".modal__window_register-close").on("click", function() {
    $("#modal__window_register").css("display", "none");
});

$(".modal__window_login-register").on("click", function() {
    $("#modal__window_register").css("display", "block");
    $("#modal__window_login").css("display", "none");
});

$(document).ready(function() {
    $('.modal__window_register-button').on('click', function(event) {
        event.preventDefault();

        var isValid = true;
        var errorSpan = $('.modal__window_register-error');
        errorSpan.text('');

        var fields = {
            name: $('.modal__window_register_input_name').val(),
            email: $('.modal__window_register_input_email').val(),
            newPassword: $('.modal__window_register_input_new_password').val(),
            confirmPassword: $('.modal__window_register_input_confirm_new_password').val()
        };


        function validateFields(fields) {

            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            function validatePersonName(name) {
                const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-'`]+$/;
                return nameRegex.test(name);
            }


            for (let key in fields) {
                if (fields[key].trim() === '') {
                    return 'Заполните все поля.';
                }
            }

            if (!validatePersonName(fields.name.trim())) {
                return 'Некорректное имя.';
            }

            if (fields.newPassword.trim() !== fields.confirmPassword.trim()) {
                return 'Пароли не совпадают.';
            }

            if (fields.newPassword.trim().length < 8) {
                return 'Пароль должен содержать не менее 8 символов.'
            }

            const email = fields.email.trim();
            if (!validateEmail(email)) {
                return 'Неверный формат электронной почты.';
            }

            return true;
        }

        answer = validateFields(fields);
        if (answer !== true) {
            errorSpan.text(answer);
            isValid = false;
        }


        if (isValid) {
            $.ajax({
                url: '/account/account_register/',
                type: 'POST',
                data: Object.assign({
                    csrfmiddlewaretoken: $('input[name="csrfregistrationtoken"]').val()
                }, fields),
                success: function(response) {
                    $("#modal__window_register").css("display", "none");
                    $("#modal__window_login").css("display", "block");
                },
                error: function(xhr, status, error) {
                    errorSpan.text(error);
                }
            });
        }
    });
});

// Модально окно входа

$(document).ready(function() {
    $('.modal__window_login-button').on('click', function(event) {
        event.preventDefault();

        var isValid = true;
        var errorSpan = $('.modal__window_login-error');
        errorSpan.text('');

        var fields = {
            email: $('.modal__window_login_input_email').val(),
            password: $('.modal__window_login_input_password').val(),
        };

        function validateFields(fields) {

            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            for (let key in fields) {
                if (fields[key].trim() === '') {
                    return 'Заполните все поля.';
                }
            }

            const email = fields.email.trim();
            if (!validateEmail(email)) {
                return 'Неверный формат электронной почты.';
            }

            return true;
        }

        answer = validateFields(fields);
        if (answer !== true) {
            errorSpan.text(answer);
            isValid = false;
        }


        if (isValid) {
            $.ajax({
                url: '/account/account_login/',
                type: 'POST',
                data: Object.assign({
                    csrfmiddlewaretoken: $('input[name="csrflogin"]').val()
                }, fields),
                success: function(response) {
                    if (response.success === true) {
                        window.location.href = "/account/";
                    }
                },
                error: function(xhr, status, error) {
                    console.log(error);
                }
            });
        }
    });
});


// Модальное окно продавца
const buttons = document.querySelectorAll('.footer__btn-seller');
const closeButtons = document.querySelectorAll('.modal__seller_close-button');
const modal = document.getElementById('modal__seller');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        if (modal) {
            modal.style.display = 'block';
        }
    });
});

closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', function() {
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Добавление в корзину


(function() {
  const baskets = document.querySelectorAll(".basket-click");
  const quantities = document.querySelectorAll(".basket__quantity");
  const minuses = document.querySelectorAll(".basket__minus");
  const pluses = document.querySelectorAll(".basket__plus");
  const inputs = document.querySelectorAll(".basket__input");

  function addProductToBasket(productId, quantity) {
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
            swal("Успешно!", "Заказ был успешно добавлен", "success");
          }
      },
      error: function(error) {
        console.log('Error adding product to cart:', error);
      }
    });
  }

  baskets.forEach((basket, index) => {
    basket.addEventListener("click", function () {
      basket.style.visibility = "hidden";
      quantities[index].style.visibility = "visible";
      inputs[index].focus();
    });

    const productId = basket.value;

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
      const quantity = parseInt(inputs[index].value);
      addProductToBasket(productId, quantity);
      basket.style.visibility = "visible";
      quantities[index].style.visibility = "hidden";
    }

    inputs[index].addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        returnBasketVisibility();
        event.preventDefault();
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