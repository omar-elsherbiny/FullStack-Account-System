const accountFormUsernameEdit = document.getElementById('account-form-username-edit');
const accountFormPasswordEdit = document.getElementById('account-form-password-edit');

const modalContainer = document.getElementById('modal-container');
const backdrop = document.getElementById('backdrop');
const usernameEditModal = document.getElementById('username-edit-modal');
const passwordEditModal = document.getElementById('password-edit-modal');

function closeModal() {
    modalContainer.classList.add('hide');
}

accountFormUsernameEdit.addEventListener('click', e => {
    modalContainer.classList.remove('hide');
    usernameEditModal.classList.remove('hide');
    passwordEditModal.classList.add('hide');
});
accountFormPasswordEdit.addEventListener('click', e => {
    modalContainer.classList.remove('hide');
    usernameEditModal.classList.add('hide');
    passwordEditModal.classList.remove('hide');
});

backdrop.addEventListener('click', closeModal);
document.addEventListener('keyup', e => {
    if (e.key == 'Escape') closeModal();
});

// username change modal
const usernameChangeCancel = document.getElementById('username-change-cancel');
const passwordChangeCancel = document.getElementById('password-change-cancel');

usernameChangeCancel.addEventListener('click', closeModal);
passwordChangeCancel.addEventListener('click', closeModal);