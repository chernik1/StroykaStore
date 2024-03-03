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

$(document).ready(function(){
    $(".header__card-pic_profile").on("click", function(e) {
      e.preventDefault();
      $("#modal__window_profile").css("display", "block");
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
});

// Модальное окно входа

$(".modal__window_login-close").on("click", function() {
    $("#modal__window_login").css("display", "none");
});

// Модальное окно регистрации

$(".modal__window_register-close").on("click", function() {
    $("#modal__window_register").css("display", "none");
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
                },
                error: function(xhr, status, error) {
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