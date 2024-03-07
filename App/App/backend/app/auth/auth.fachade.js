require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function hashPassword(password) {
    return bcrypt.hashSync(password);
}

function comparePasswords(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

function generateAccessToken(userInfo, SECRET_KEY, expiresIn) {
    console.log(userInfo);
    return jwt.sign(userInfo, SECRET_KEY, { expiresIn });
}

function verifyToken(token, SECRET_KEY) {
    return jwt.verify(token, SECRET_KEY);
}

function getPayload(token){
    return jwt.decode(token, verify=false);
}

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}
module.exports = {
  hashPassword,
  comparePasswords,
  generateAccessToken,
  verifyToken,
  getPayload,
  generateToken
};