// Функция для сохранения данных
$(document).ready(function() {
    $('.account__data-save').on('click', function(event) {
        event.preventDefault();

        var isValid = true;
        var errorSpan = $('.account__data-error');
        errorSpan.text('');

        var fields = {
            name: $('.account__data-name-input').val(),
            surname: $('.account__data-surname-input').val(),
            birthday: $('.account__data-birthday-input').val(),
            phone: $('.account__data-phone-input').val(),
            email: $('.account__data-email-input').val(),
        };


        function validateFields(fields) {

            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

             function validatePhone(phone) {
                const phoneRegex = /^\+375 (25|29|33|44) \d{3} \d{4}$/;
                return phoneRegex.test(phone);
            }

            function validatePersonName(name) {
                const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-'`]+$/;
                return nameRegex.test(name);
            }

            function validateBirthday(birthday) {
                const birthdayRegex = /^\d{2}.\d{2}.\d{4}$/;
                return birthdayRegex.test(birthday);
            }


            for (let key in fields) {
                if (fields[key].trim() === '') {
                    return 'Заполните все поля.';
                }
            }

            if (!validatePersonName(fields.name.trim())) {
                return 'Некорректное имя.';
            }

            if (!validatePersonName(fields.surname.trim())) {
                return 'Некорректная фамилия.';
            }

            if (!validatePhone(fields.phone.trim())) {
                return 'Неверный формат телефона.';
            }

            if (!validateBirthday(fields.birthday.trim())) {
                return 'Неверный формат даты рождения.';
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
                url: '/account/account_change/',
                type: 'POST',
                data: Object.assign({
                    csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
                }, fields),
                success: function(response) {
                    if (response.success === true) {
                        window.location.href = "/";
                    }
                },
                error: function(xhr, status, error) {
                }
            });
        }
    });
});


function handleLogout() {
    $.ajax({
        type: 'POST',
        data: Object.assign({
                    csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
                }),
        url: '/account/account_logout/',
        success: function(response) {
            window.location.href = '/';
        },
        error: function(xhr, status, error) {
            console.error('Logout failed: ' + error);
        }
    });
}
$(document).ready(function(){
    $(".account__logout").on("click", function() {
        handleLogout();
    });
});