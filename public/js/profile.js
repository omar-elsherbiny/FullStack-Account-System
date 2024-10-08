const profilePicture = document.getElementById('profile-picture');
const profileBanner = document.getElementById('profile-banner');

const aboutMeTextbox = document.getElementById('about-me-textbox');
const editButton = document.getElementById('profile-edit-button');
const editUpdate = document.getElementById('profile-edit-update');
const editCancel = document.getElementById('profile-edit-cancel');
const content = document.getElementById('content');
const editMenu = document.getElementById('edit-menu');

const editDisplayName = document.getElementById('profile-edit-display-name');
const editShowMemberSince = document.getElementById(
    'profile-edit-show-member-since'
);
const editAboutMeTextbox = document.getElementById(
    'profile-edit-about-me-textbox'
);

const profileEditPfp = document.getElementById('profile-edit-pfp');
const profileEditBanner = document.getElementById('profile-edit-banner');

const profileEditRemovePfp = document.getElementById('profile-edit-remove-pfp');
const profileEditRemovePfpField = document.getElementById('profile-edit-remove-pfp-field');
const profileEditRemoveBanner = document.getElementById('profile-edit-remove-banner');
const profileEditRemoveBannerField = document.getElementById('profile-edit-remove-banner-field');

const backdrop = document.getElementById('backdrop');
const modalContainer = document.getElementById('modal-container');
const modal = document.getElementById('modal');
const cropCancel = document.getElementById('crop-cancel');

let croppie;
let isBanner;

profileEditPfp.addEventListener('input', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        modalContainer.classList.remove('hide');
        editMenu.inert = true;
        const url = reader.result;

        croppie = new Croppie(document.getElementById('crop-editor'), {
            viewport: { width: 200, height: 200, type: 'square' },
        });

        document.querySelector('.cr-viewport').style.borderRadius = '50%';

        croppie.bind({
            url: url,
        });
    };

    reader.readAsDataURL(file);
});

function rangeLerp(
    inputValue,
    inputRangeStart = 0,
    InputRangeEnd = 1,
    OutputRangeStart,
    OutputRangeEnd,
    capInput = false,
    decimalPlaces = 1) {
    let t = inputValue;
    if (capInput) {
        t = Math.max(Math.min(t, InputRangeEnd), inputRangeStart);
    }
    let res = OutputRangeStart * (InputRangeEnd - t) + OutputRangeEnd * (t - inputRangeStart);
    res /= (InputRangeEnd - inputRangeStart);
    return res.toFixed(decimalPlaces);
}

profileEditBanner.addEventListener('input', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        modalContainer.classList.remove('hide');
        editMenu.inert = true;
        const url = reader.result;

        isBanner = true;

        const viewportWidth = rangeLerp(modal.getBoundingClientRect().width, 256, 571, 150, 450, false, 2)

        croppie = new Croppie(document.getElementById('crop-editor'), {
            viewport: { width: viewportWidth, height: viewportWidth / 5, type: 'square' },
        });

        croppie.bind({
            url: url,
        });
    };

    reader.readAsDataURL(file);
});

cropCancel.addEventListener('click', closePfpModal);
backdrop.addEventListener('click', closePfpModal);
document.addEventListener('keyup', (e) => {
    if (e.key == 'Escape') closePfpModal();
});

document.getElementById('crop-confirm').addEventListener('click', (e) => {
    croppie
        .result({
            type: 'blob',
            format: 'jpeg',
            backgroundColor: '#FFFFFF',
            size: isBanner
                ? { width: 640, height: 128 }
                : { width: 200, height: 200 },
        })
        .then(function (blob) {
            applyImageCropping(blob);
        });
});

let previousPfp = profilePicture.src;
let previousBanner = profileBanner.src;

function applyImageCropping(blob) {
    modalContainer.classList.add('hide');
    editMenu.inert = false;

    let file = new File([blob], 'image.jpeg', {
        type: 'image/jpeg',
        lastModified: new Date().getTime(),
    });
    let container = new DataTransfer();
    container.items.add(file);

    const url = URL.createObjectURL(blob);

    if (isBanner) {
        profileEditBanner.files = container.files;
        profileBanner.src = url;
        profileEditRemoveBannerField.value = '0';
    } else {
        profileEditPfp.files = container.files;
        profilePicture.src = url;
        profileEditRemovePfpField.value = '0';
    }

    isBanner = false;
    if (croppie) croppie.destroy();
}

if (editButton) {
    editButton.addEventListener('click', () => {
        editMenu.classList.remove('hide');
        content.classList.add('hide');
    });
}

editCancel.addEventListener('click', () => {
    profilePicture.src = previousPfp;
    profileBanner.src = previousBanner;

    editMenu.classList.add('hide');
    content.classList.remove('hide');
});

function closePfpModal() {
    if (!modalContainer.classList.contains('hide')) {
        modalContainer.classList.add('hide');
        editMenu.inert = false;

        let container = new DataTransfer();
        profileEditPfp.files = container.files;
        profileEditBanner.files = container.files;
    }

    isBanner = false;
    if (croppie) croppie.destroy();
}

const editProfilePicture = document.getElementById('edit-profile-picture');
const editHamburgerMenu = document.getElementById('edit-hamburger-menu');

editProfilePicture.addEventListener('click', (event) => {
    editHamburgerMenu.classList.toggle('closed');
});

document.addEventListener('click', (event) => {
    if (
        !editHamburgerMenu.contains(event.target) &&
        !editProfilePicture.contains(event.target)
    ) {
        editHamburgerMenu.classList.add('closed');
    }
});

const editBannerPicture = document.getElementById('edit-banner-picture');
const editBannerHamburgerMenu = document.getElementById('edit-banner-hamburger-menu');

editBannerPicture.addEventListener('click', (event) => {
    editBannerHamburgerMenu.classList.toggle('closed');
});

document.addEventListener('click', (event) => {
    if (
        !editBannerHamburgerMenu.contains(event.target) &&
        !editBannerPicture.contains(event.target)
    ) {
        editBannerHamburgerMenu.classList.add('closed');
    }
});

profileEditRemovePfp.addEventListener('click', (event) => {
    profileEditRemovePfpField.value = '1';
    profilePicture.src = '/media/profile-placeholder.png';
    editHamburgerMenu.classList.toggle('closed');
});

profileEditRemoveBanner.addEventListener('click', (event) => {
    profileEditRemoveBannerField.value = '1';
    profileBanner.src = '/media/banner-placeholder.png';
    editBannerHamburgerMenu.classList.toggle('closed');
});