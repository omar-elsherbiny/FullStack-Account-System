const accountFormUsernameEdit = document.getElementById('account-form-username-edit');
const accountFormPasswordEdit = document.getElementById('account-form-password-edit');

const modalContainer = document.getElementById('modal-container');
const backdrop = document.getElementById('backdrop');
const usernameEditModal = document.getElementById('username-edit-modal');
const passwordEditModal = document.getElementById('password-edit-modal');

function closeModal() {
    modalContainer.classList.add('hide');
}
function openUsernameModal() {
    modalContainer.classList.remove('hide');
    usernameEditModal.classList.remove('hide');
    passwordEditModal.classList.add('hide');
}
function openPasswordModal() {
    modalContainer.classList.remove('hide');
    usernameEditModal.classList.add('hide');
    passwordEditModal.classList.remove('hide');
}

accountFormUsernameEdit.addEventListener('click', openUsernameModal);
accountFormPasswordEdit.addEventListener('click', openPasswordModal);

backdrop.addEventListener('click', closeModal);
document.addEventListener('keyup', e => {
    if (e.key == 'Escape') closeModal();
});

// username change modal
const usernameChangeCancel = document.getElementById('username-change-cancel');
const passwordChangeCancel = document.getElementById('password-change-cancel');

usernameChangeCancel.addEventListener('click', closeModal);
passwordChangeCancel.addEventListener('click', closeModal);

const urlParams = new URLSearchParams(window.location.search);

const modalParam = urlParams.get('modal');
if (modalParam == '0') {
    openUsernameModal();
} else if (modalParam == '1') {
    openPasswordModal();
}