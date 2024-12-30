import "./styles.css";

const formController = (function() {

    const formEl = document.getElementById('js-validation-form');

    const emailInput = document.getElementById('user-email');
    const emailErrorUl = document.querySelector('#user-email + ul.input-errors');

    const countryInput = document.getElementById('user-country');
    const countryErrorUl = document.querySelector('#user-country + ul.input-errors');

    const zipcodeInput = document.getElementById('user-zipcode');
    const zipcodeErrorUl = document.querySelector('#user-zipcode + ul.input-errors');

    const pwInput = document.getElementById('user-password');
    const pwErrorUl = document.querySelector('#user-password + ul.input-errors');

    const pwConfirmInput = document.getElementById('user-password-confirm');
    const pwConfirmErrorUl = document.querySelector('#user-password-confirm + ul.input-errors');

    const submitBtn = document.getElementById('form-submit');

    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    const makeListItem = (textContent) => {
        const result = document.createElement('li');
        result.textContent = textContent;
        return result;
    }

    emailInput.addEventListener('blur', (e) => {
        emailErrorUl.innerHTML = '';
        emailInput.classList.remove('invalid');
        emailInput.classList.remove('valid');

        let isValid = true;

        if (!emailInput.value || emailInput.value === "") {
            emailErrorUl.appendChild(makeListItem('Email is a required field.'));
            isValid = false;
        }

        if (emailInput.validity.typeMismatch) {
            emailErrorUl.appendChild(makeListItem('Please enter a valid email address.'));
            isValid = false;
        }

        if (emailInput.validity.tooShort) {
            emailErrorUl.appendChild(makeListItem('Provided email is too short. Minimum length: 6.'));
            isValid = false;
        }

        if (isValid) {
            emailInput.classList.add('valid');
        } else {
            emailInput.classList.add('invalid');
        }
    });

    countryInput.addEventListener('blur', (e) => {
        countryErrorUl.innerHTML = '';
        countryInput.classList.remove('invalid');
        countryInput.classList.remove('valid');

        let isValid = true;

        if (!countryInput.value || countryInput.value === "") {
            countryErrorUl.appendChild(makeListItem('Country is a required field.'));
            isValid = false;
        }

        const alphaOnly = countryInput.value.match(/^[A-Za-z\s]*$/);
        if (alphaOnly === null) {
            countryErrorUl.appendChild(makeListItem('Only alphabetical characters allowed.'));
            isValid = false;
        }

        if (countryInput.validity.tooShort) {
            countryErrorUl.appendChild(makeListItem('Please enter full country name. Minimum lenth: 3.'));
            isValid = false;
        }

        if (isValid) {
            countryInput.classList.add('valid');
        } else {
            countryInput.classList.add('invalid');
        }
    });

    zipcodeInput.addEventListener('blur', (e) => {
        zipcodeErrorUl.innerHTML = '';
        zipcodeInput.classList.remove('invalid');
        zipcodeInput.classList.remove('valid');

        let isValid = true;
        
        if (!zipcodeInput.value || zipcodeInput.value === "") {
            zipcodeErrorUl.appendChild(makeListItem('Zipcode is a required field.'));
            isValid = false;
        }

        const numbersOnly = zipcodeInput.value.match(/^[0-9]*$/);
        if (numbersOnly === null) {
            zipcodeErrorUl.appendChild(makeListItem('Please enter a valid zipcode. Numbers only.'));
            isValid = false;
        }

        if (zipcodeInput.validity.tooLong) {
            zipcodeErrorUl.appendChild(makeListItem('Provided zipcode is too long.'));
            isValid = false;
        }

        if (zipcodeInput.validity.tooShort) {
            zipcodeErrorUl.appendChild(makeListItem('Provided zipcode is too short.'));
            isValid = false;
        }

        if (isValid) {
            zipcodeInput.classList.add('valid');
        } else {
            zipcodeInput.classList.add('invalid');
        }
    });

    pwInput.addEventListener('blur', (e) => {
        pwErrorUl.innerHTML = '';

        pwInput.classList.remove('invalid');
        pwInput.classList.remove('valid');

        let pwIsValid = true;

        // I don't know how to enforce password character requirements with RegEx.

        if (!pwInput.value || pwInput.value === '') {
            pwErrorUl.appendChild(makeListItem('Password is a required field.'))
            pwIsValid = false;
        }

        if (pwInput.validity.tooShort) {
            pwErrorUl.appendChild(makeListItem('Password must be at least 6 characters.'))
            pwIsValid = false;
        }


        if (pwIsValid) {
            pwInput.classList.add('valid');
        } else {
            pwInput.classList.add('invalid');
        }
    });

    pwConfirmInput.addEventListener('blur', (e) => {
        pwConfirmErrorUl.innerHTML = '';

        pwConfirmInput.classList.remove('invalid');
        pwConfirmInput.classList.remove('valid');

        let pwConfirmIsValid = true;

        if (!pwConfirmInput.value || pwConfirmInput.value === '') {
            pwConfirmErrorUl.appendChild(makeListItem('Confirm password is a required field.'))
            pwConfirmIsValid = false;
        }

        if (pwConfirmInput.value !== pwInput.value) {
            pwConfirmErrorUl.appendChild(makeListItem('Password and Confirm Password must match.'))
            pwConfirmIsValid = false;
        }

        if (pwConfirmIsValid) {
            pwConfirmInput.classList.add('valid');
        } else {
            pwConfirmInput.classList.add('invalid');
        }
    
    });

})();

