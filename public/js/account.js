const accountFormUsernameEdit = document.getElementById('account-form-username-edit');
const accountFormPasswordEdit = document.getElementById('account-form-password-edit');
const deleteButton = document.getElementById('delete-button');

const modalContainer = document.getElementById('modal-container');
const backdrop = document.getElementById('backdrop');
const usernameEditModal = document.getElementById('username-edit-modal');
const passwordEditModal = document.getElementById('password-edit-modal');
const deleteAccountModal = document.getElementById('delete-account-modal');

function closeModal() {
    modalContainer.classList.add('hide');
}
function openUsernameModal() {
    modalContainer.classList.remove('hide');
    usernameEditModal.classList.remove('hide');
    passwordEditModal.classList.add('hide');
    deleteAccountModal.classList.add('hide');
}
function openPasswordModal() {
    modalContainer.classList.remove('hide');
    usernameEditModal.classList.add('hide');
    passwordEditModal.classList.remove('hide');
    deleteAccountModal.classList.add('hide');
}
function openDeleteModal() {
    modalContainer.classList.remove('hide');
    usernameEditModal.classList.add('hide');
    passwordEditModal.classList.add('hide');
    deleteAccountModal.classList.remove('hide');
}

accountFormUsernameEdit.addEventListener('click', openUsernameModal);
accountFormPasswordEdit.addEventListener('click', openPasswordModal);
deleteButton.addEventListener('click', openDeleteModal);

backdrop.addEventListener('click', closeModal);
document.addEventListener('keyup', e => {
    if (e.key == 'Escape') closeModal();
});

// username change modal
const usernameChangeCancel = document.getElementById('username-change-cancel');
const passwordChangeCancel = document.getElementById('password-change-cancel');
const deleteCancel = document.getElementById('delete-cancel');

usernameChangeCancel.addEventListener('click', closeModal);
passwordChangeCancel.addEventListener('click', closeModal);
deleteCancel.addEventListener('click', closeModal);

const urlParams = new URLSearchParams(window.location.search);

const modalParam = urlParams.get('modal');
if (modalParam == '0') {
    openUsernameModal();
    window.history.pushState({}, document.title, 'account');
} else if (modalParam == '1') {
    openPasswordModal();
    window.history.pushState({}, document.title, 'account');
}

// password validation
const passwordNewField = document.getElementById('password-new-field');
const passwordConfirmField = document.getElementById('password-confirm-field');

const passwordRegex = {
    main: /^(?! )(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}(?<! )$/,
    trim: /^(?! ).*(?<! )$/,
    length: /^.{8,}$/,
    lowerChar: /^(?=.*[a-z]).*$/,
    upperChar: /^(?=.*[A-Z]).*$/,
    num: /^(?=.*\d).*$/,
    specialChar: /^(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).*$/,
};
const passwordErrorMsg = {
    trim: 'must not start or end with space',
    length: 'length must be greater than or equal to 8',
    lowerChar: 'must contain a lowercase character',
    upperChar: 'must contain an uppercase character',
    num: 'must contain a number',
    specialChar: 'must contain a special character',
};

passwordNewField.addEventListener('input', () => {
    if (passwordNewField.value.match(passwordRegex.main)) {
        passwordNewField.setCustomValidity('');
    } else {
        let errorString = 'Password ';
        let isFirst = true;

        for (const key in passwordRegex) {
            if (key == 'main') continue;

            if (!passwordNewField.value.match(passwordRegex[key])) {
                errorString += (isFirst ? '' : ', ') + passwordErrorMsg[key]
                isFirst = false
            }
        }

        passwordNewField.setCustomValidity(errorString);
    }
});
passwordConfirmField.addEventListener('input', () => {
    if (passwordConfirmField.value == passwordNewField.value) {
        passwordConfirmField.setCustomValidity('');
    } else {
        passwordConfirmField.setCustomValidity('Passwords do not match')
    }
});

// username validation
const usernameEditField = document.getElementById('username-edit-field');

const usernameRegex = /^[A-Za-z\d_\-\.!#$%&]{3,30}$/;
const usernameErrorMsg = 'Username must be between 3 and 30 characters long';

usernameEditField.addEventListener('input', () => {
    if (usernameEditField.value.match(usernameRegex)) {
        usernameEditField.setCustomValidity('');
    } else {
        usernameEditField.setCustomValidity(usernameErrorMsg);
    }
});
