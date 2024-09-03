const bcrypt = require('bcrypt');

const getHash = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const compareHash = async (unHashedPassword, storedHash) => {
    const match = await bcrypt.compare(unHashedPassword, storedHash);
    return match;
}

module.exports = {
    getHash: getHash,
    compareHash: compareHash
};