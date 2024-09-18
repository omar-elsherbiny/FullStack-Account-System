const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (request, file, callback) {
        callback(null, `pfp_${request.session.user.id}.jpeg`);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (request, file, callback) {
        const extension = getExtension(file.originalname);
        if (extension != 'jpeg') {
            request.fileValidationError = "Forbidden extension";
            return callback(null, false, request.fileValidationError);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});

const { loginRequired } = require('../src/funcs');
const collection = require('../src/dbconfig');

const getExtension = (fileName) => fileName.split('.')[fileName.split('.').length - 1];

router.get('/', loginRequired, (request, result) => {
    result.redirect('/profile/' + request.session.user.username);
});

router.get('/:username', async (request, result, next) => {
    const searched_user = await collection.findOne({ username: request.params.username });
    if (searched_user) {
        result.render('profile', {
            alerts: request.flash('alerts'),
            username: request.session.user.username,
            displayName: request.session.user.displayName,
            pfpPath: request.session.user.pfpPath,
            profileUsername: searched_user.username,
            profileDisplayName: searched_user.displayName,
            canEdit: request.session.user ? (request.session.user.username == request.params.username) : false,
            memberSince: (searched_user.memberSince).toLocaleDateString('en-GB'),
            showMemberSince: searched_user.showMemberSince,
            aboutMe: searched_user.aboutMe,
            pfpPathSearched: searched_user.pfpPath ? '/uploads/' + searched_user.pfpPath : '/media/profile-icon.png',
        });
    } else {
        next();
    }
});

router.post('/:username/update-profile',
    loginRequired,
    upload.single('profile-edit-pfp'),
    body('profile-edit-display-name').trim().isLength({ min: 0, max: 30 }).escape(),
    body('profile-edit-about-me-textbox').trim().isLength({ min: 0, max: 500 }).escape(),
    async (request, result, next) => {
        if (request.session.user.username != request.params.username) {
            result.status(401).render('error', { errorCode: 401, errorMessage: 'Unauthorized to update profile' });
            return;
        }

        try {
            let data = {
                displayName: request.body['profile-edit-display-name'],
                showMemberSince: request.body['profile-edit-show-member-since'] == 'on' ? true : false,
                aboutMe: request.body['profile-edit-about-me-textbox'],
            };

            const validation = validationResult(request);

            if (!validation.isEmpty()) {
                for (let i = 0; i < validation.errors.length; i++) {
                    if (validation.errors[i].path == 'profile-edit-display-name') {
                        request.flash('alerts', [{ content: 'Invalid display name input', type: 'error' }]);
                    }
                    if (validation.errors[i].path == 'profile-edit-about-me-textbox') {
                        request.flash('alerts', [{ content: 'Invalid about me input', type: 'error' }]);
                    }
                }

                result.redirect('/profile');
                return;
            }

            if (request.fileValidationError) {
                request.flash('alerts', [{ content: request.fileValidationError, type: 'caution' }]);
                throw new Error(request.fileValidationError);
            }

            if (request.file) {
                data.pfpPath = `pfp_${request.session.user.id}.jpeg`;
                request.session.user.pfpPath = data.pfpPath ? '/uploads/' + data.pfpPath : '/media/profile-icon.png';
            }

            request.session.user.displayName = data.displayName;

            await collection.findOneAndUpdate({ _id: request.session.user.id }, data);

            request.flash('alerts', [{ content: 'Profile updated successfully', type: 'success' }]);
        } catch (error) {
            request.flash('alerts', [{ content: 'Error updating profile', type: 'error' }]);
        }
        result.redirect('/profile');
    });

module.exports = router;