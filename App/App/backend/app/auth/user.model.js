const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String, required: true, unique: true, trim: true
        },
        password: {
            type: String, required: true, unique: true, trim: true
        },
        resetOTP: {
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