const accountFormUsernameEdit = document.getElementById('account-form-username-edit');
const accountFormPasswordEdit = document.getElementById('account-form-password-edit');

const modalContainer = document.getElementById('modal-container');
const backdrop = document.getElementById('backdrop');
const modal = document.getElementById('modal');

accountFormUsernameEdit.addEventListener('click', e => {
    modalContainer.classList.remove('hide');
});
accountFormPasswordEdit.addEventListener('click', e => {
    modalContainer.classList.remove('hide');
});

backdrop.addEventListener('click', closeModal);
document.addEventListener('keyup', e => {
    if (e.key == 'Escape') closeModal();
});

function closeModal() {
    modalContainer.classList.add('hide');
}