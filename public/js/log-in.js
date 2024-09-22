const modalContainer = document.getElementById('modal-container');
const cancelRestore = document.getElementById('cancel-restore');

cancelRestore.addEventListener('click', e => {
    modalContainer.classList.add('hide');
});