const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String, required: true, unique: true, trim: true
        },
        email: {
            type: String, required: true, unique: true, trim: true
        },
        password: {
            type: String, required: true, trim: true
        },
        roles: {
            type: [String], required: true, default: ['jammer']
        },
        resetToken: {
            type: String,
            default: null,
            expires: 900
        }
    },
    {
        versionKey: false,
    }
)

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;