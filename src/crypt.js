const bcrypt = require('bcrypt');

async function getHash(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function compareHash(unHashedPassword, storedHash) {
    const match = await bcrypt.compare(unHashedPassword, storedHash);
    return match;
}

module.exports = {
    getHash: getHash,
    compareHash: compareHash
};