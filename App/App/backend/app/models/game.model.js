const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
    {
        title: {
            type: String, required: true, unique: true, trim: true
        },
        description: {
            type: String, required: true, trim: true
        },
        teamID: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            unique: true, 
            ref: 'Team'
        },
        buildLink: {
            type: String, required: true, trim: true
        },
        youtubeLinkGameplay: {
            type: String, required: true, trim: true
        },
        youtubeLinkPitch: {
            type: String, required: true, trim: true
        },
        categories: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
        ]
    },
    {
        versionKey: false,
    }
)

const GameModel = mongoose.model('Game', gameSchema);

module.exports = GameModel