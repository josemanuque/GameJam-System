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
    }
)

const RoleModel = mongoose.model('Role', roleSchema);

module.exports = RoleModel