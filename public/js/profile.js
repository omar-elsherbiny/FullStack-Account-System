const aboutMeTextbox = document.getElementById('about-me-textbox');
const editButton = document.getElementById('profile-edit-button');
const editUpdate = document.getElementById('profile-edit-update');
const editCancel = document.getElementById('profile-edit-cancel');
const content = document.getElementById('content');
const editMenu = document.getElementById('edit-menu');

const editDisplayName = document.getElementById('profile-edit-display-name');
const editShowMemberSince = document.getElementById('profile-edit-show-member-since');

editButton.addEventListener('click', () => {
    editMenu.classList.remove('hide');
    content.classList.add('hide');
});

editCancel.addEventListener('click', () => {
    editMenu.classList.add('hide');
    content.classList.remove('hide');
});

editUpdate.addEventListener('click', async () => {
    fetch(`/profile/${document.URL.split('/')[document.URL.split('/').length - 1]}/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            displayName: editDisplayName.value,
            showMemberSince: editShowMemberSince.checked,
        })
    }).then(response => response.json()).then(data => {
        const displayName = document.getElementById('display-name');
        const userName = document.getElementById('user-name');
        const memberSince = document.getElementById('member-since');
        const aboutMe = document.getElementById('about-me');

        if (displayName) {
            displayName.parentElement.removeChild(displayName);
        }

        if (editDisplayName.value) {
            userName.outerHTML = /*html*/`
            <h1 id="display-name">${editDisplayName.value}</h1>
            <h3 id="user-name">@${data.username}</h3>
            `;
        } else {
            userName.outerHTML = /*html*/`
            <h1 id="user-name">@${data.username}</h1>
            `;
        }

        if (!editShowMemberSince.checked) {
            memberSince.textContent = " ";
        } else {
            memberSince.textContent = `Member since: ${data.memberSince}`;
        }

        editMenu.classList.add('hide');
        content.classList.remove('hide');
    }).catch(error => {
        console.error(error);
    });
});