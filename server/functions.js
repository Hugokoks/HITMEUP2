const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');


exports.generateID = function (length = 80) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    while (id.length < length) {
        const randomBytes = crypto.randomBytes(1);
        const randomChar = randomBytes.toString('hex');
        const char = characters[parseInt(randomChar, 16) % characters.length];
        id += char;
    }
    return id;
};

exports.deleteFile = function (filename) {
    const filePath = path.join(__dirname, 'uploads', filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting the file:', err);
        } else {
            console.log(`${filename} was deleted successfully.`);
        }
    });
};

exports.deleteFile = function (filename) {
    const filePath = path.join(__dirname, 'uploads', filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting the file:', err);
        } else {
            console.log(`${filename} was deleted successfully.`);
        }
    });
};

exports.getHashPassword = async function (password) {
    const saltRounds = 10; // Defines how secure the hash will be
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};
