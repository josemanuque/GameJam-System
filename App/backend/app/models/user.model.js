const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true, trim: true
        },
        lastname: {
            type: String, required: true, trim: true
        },
        username: {
            type: String, required: true, unique: true, trim: true
        },
        email: {
            type: String, required: true, unique: true, trim: true
        },
        password: {
            type: String, required: true, trim: true
        },
        phone:{
            type: String, trim: true
        },
        roles: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
        ],
        region: {
            type: String, trim: true
        },
        site: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Site'
        },
        photo: {
            data: String
        }
    }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;