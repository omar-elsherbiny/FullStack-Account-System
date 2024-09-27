const signUpPassword = document.getElementById('sign-up-password');
const signUpUsername = document.getElementById('sign-up-username');

const usernameRegex = /^[A-Za-z\d_\-\.!#$%&]{3,30}$/;
const passwordRegex = {
    main: /^(?! )(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}(?<! )$/,
    trim: /^(?! ).*(?<! )$/,
    length: /^.{8,}$/,
    lowerChar: /^(?=.*[a-z]).*$/,
    upperChar: /^(?=.*[A-Z]).*$/,
    num: /^(?=.*\d).*$/,
    specialChar: /^(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).*$/,
};

const usernameErrorMsg = 'Username must be between 3 and 30 characters long';
const passwordErrorMsg = {
    trim: 'must not start or end with space',
    length: 'length must be greater than or equal to 8',
    lowerChar: 'must contain a lowercase character',
    upperChar: 'must contain an uppercase character',
    num: 'must contain a number',
    specialChar: 'must contain a special character',
};

signUpUsername.addEventListener('input', () => {
    if (signUpUsername.value.match(usernameRegex.main)) {
        signUpUsername.setCustomValidity('');
    } else {
        signUpUsername.setCustomValidity(usernameErrorMsg);
    }
});

signUpPassword.addEventListener('input', () => {
    if (signUpPassword.value.match(passwordRegex.main)) {
        signUpPassword.setCustomValidity('');
    } else {
        let errorString = 'Password ';
        let isFirst = true;

        for (const key in passwordRegex) {
            if (key == 'main') continue;

            if (!signUpPassword.value.match(passwordRegex[key])) {
                errorString += (isFirst ? '' : ', ') + passwordErrorMsg[key]
                isFirst = false
            }
        }

        signUpPassword.setCustomValidity(errorString);
    }
});