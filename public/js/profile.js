const aboutMeTextbox = document.getElementById('about-me-textbox');
const editButton = document.getElementById('profile-edit-button');
const editUpdate = document.getElementById('profile-edit-update');
const editCancel = document.getElementById('profile-edit-cancel');
const content = document.getElementById('content');
const editMenu = document.getElementById('edit-menu');

const editDisplayName = document.getElementById('profile-edit-display-name');
const editShowMemberSince = document.getElementById('profile-edit-show-member-since');
const editAboutMeTextbox = document.getElementById('profile-edit-about-me-textbox');

editButton.addEventListener('click', () => {
    editMenu.classList.remove('hide');
    content.classList.add('hide');
});

editCancel.addEventListener('click', () => {
    editMenu.classList.add('hide');
    content.classList.remove('hide');
});