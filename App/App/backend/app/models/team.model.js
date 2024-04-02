const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true, unique: true, trim: true
        },
        description: {
            type: String, trim: true
        },
        members: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        ]
    }
)

const TeamModel = mongoose.model('Team', teamSchema);

module.exports = TeamModel
