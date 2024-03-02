// Функция для сохранения данных
$(document).ready(function() {
    $('.account__data-save').on('click', function(event) {
        event.preventDefault();

        var isValid = true;
        var errorSpan = $('.account__data-error');
        errorSpan.text('');

        var fields = {
            name: $('.account__data-name-input'),
            surname: $('.account__data-surname-input'),
            birthday: $('.account__data-birthday-input'),
            phone: $('.account__data-phone-input'),
            email: $('.account__data-email-input'),
            newPassword: $('.account__data-password-input'),
            confirmPassword: $('.account__data-password-input-confirm')
        };


        for (var fieldName in fields) {
            if (!fields[fieldName].val()) {
                errorSpan.text('Пожалуйста, заполните все поля.');
                isValid = false;
                break;
            }
        }

        // Check if passwords match
        if (fields.newPassword !== fields.confirmPassword) {
            alert('Passwords do not match.');
            isValid = false;
        }

        // If all fields are valid, send AJAX request
        if (isValid) {
            $.ajax({
                url: '/your-endpoint', // Replace with your server endpoint
                type: 'POST',
                data: fields,
                success: function(response) {
                    // Handle success
                    alert('Information saved successfully!');
                },
                error: function(xhr, status, error) {
                    alert('An error occurred: ' + error);
                }
            });
        }
    });
});