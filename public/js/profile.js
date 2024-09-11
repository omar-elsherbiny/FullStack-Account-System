const profilePicture = document.getElementById('profile-picture');

const aboutMeTextbox = document.getElementById('about-me-textbox');
const editButton = document.getElementById('profile-edit-button');
const editUpdate = document.getElementById('profile-edit-update');
const editCancel = document.getElementById('profile-edit-cancel');
const content = document.getElementById('content');
const editMenu = document.getElementById('edit-menu');

const editDisplayName = document.getElementById('profile-edit-display-name');
const editShowMemberSince = document.getElementById('profile-edit-show-member-since');
const editAboutMeTextbox = document.getElementById('profile-edit-about-me-textbox');

const profileEditPfp = document.getElementById('profile-edit-pfp');

const backdrop = document.getElementById('backdrop');
const modalContainer = document.getElementById('modal-container');
const cropCancel = document.getElementById('crop-cancel');

const croppie = new Croppie(document.getElementById('crop-editor'), {
    viewport: { width: 200, height: 200, type: 'square' },
});

profileEditPfp.addEventListener('input', e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        modalContainer.classList.remove('hide');
        editMenu.inert = true;
        const url = reader.result;

        croppie.bind({
            url: url
        })
    }

    reader.readAsDataURL(file);
});

cropCancel.addEventListener('click', closePfpModal);
backdrop.addEventListener('click', closePfpModal);
document.addEventListener('keyup', e => {
    if (e.key == 'Escape') closePfpModal();
});

document.getElementById('crop-confirm').addEventListener('click', e => {
    croppie.result('blob', {
        format: 'jpeg',
    }).then(function (blob) {
        modalContainer.classList.add('hide');
        editMenu.inert = false;

        let file = new File([blob], "image.jpeg", { type: "image/jpeg", lastModified: new Date().getTime() });
        let container = new DataTransfer();
        container.items.add(file);

        profileEditPfp.files = container.files;

        const url = URL.createObjectURL(blob);
        profilePicture.src = url;
    });
});

editButton.addEventListener('click', () => {
    editMenu.classList.remove('hide');
    content.classList.add('hide');
});

editCancel.addEventListener('click', () => {
    editMenu.classList.add('hide');
    content.classList.remove('hide');
});

function closePfpModal() {
    if (!modalContainer.classList.contains('hide')) {
        modalContainer.classList.add('hide');
        editMenu.inert = false;

        let container = new DataTransfer();
        profileEditPfp.files = container.files;
    }
}