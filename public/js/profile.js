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

const croppie = new Croppie(document.getElementById('crop-editor'), {
    viewport: { width: 200, height: 200, type: 'square' },
});

profileEditPfp.addEventListener('input', e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        document.getElementById('modal').classList.remove('hide');
        const url = reader.result;

        croppie.bind({
            url: url
        })
    }

    reader.readAsDataURL(file);
})

document.getElementById('crop-confirm').addEventListener('click', e => {
    croppie.result('blob', {
        format: 'jpeg',
    }).then(function (blob) {
        document.getElementById('modal').classList.add('hide');
        let file = new File([blob], "image.jpeg", { type: "image/jpeg", lastModified: new Date().getTime() });
        let container = new DataTransfer();
        container.items.add(file);
        profileEditPfp.files = container.files;
    })
});

editButton.addEventListener('click', () => {
    editMenu.classList.remove('hide');
    content.classList.add('hide');
});

editCancel.addEventListener('click', () => {
    editMenu.classList.add('hide');
    content.classList.remove('hide');
});