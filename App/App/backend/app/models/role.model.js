const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true, 
            unique: true, 
            trim: true
        },
        description: {
            type: String, 
            default: null,
            trim: true
        }
    },
    {
        versionKey: false,
    }
)

const RoleModel = mongoose.model('Role', userSchema);

module.exports = UserModel