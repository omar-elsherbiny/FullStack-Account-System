const authUser = (request, result, next) => {
    const now = Date.now();
    if (!request.session.keepLogged &&
        (now - request.session.timestamp) >
        (process.env.node_env == 'development' ? 1000 * 60 : 1000 * 60 * 60 * 3)) { // 1 min / 3 hours
        request.session.user = null;
    }
    request.session.timestamp = now;
    next();
}

const loginRequired = (request, result, next) => {
    if (request.session.user) {
        next();
    } else {
        result.redirect('/account/log-in');
    }
}

module.exports = {
    authUser: authUser,
    loginRequired: loginRequired,
}