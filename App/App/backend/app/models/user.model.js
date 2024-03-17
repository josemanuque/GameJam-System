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
        roles: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
        ]
    }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;