const mongoose = require('mongoose');

const jamSchema = new mongoose.Schema(
    {
        title: {
            type: String, required: true, unique: true, trim: true
        },
        description: {
            type: String, required: true, trim: true
        },
        startingDate: {
            type: Date, required: true
        },
        endingDate: {
            type: Date, required: true
        },
        theme : {
            type: mongoose.Schema.Types.ObjectId, ref: 'Theme'
        },
        sites: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Site'
        }],
        stages: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Stage'
        }]
    },
    {
        versionKey: false,
    }
)

const JamModel = mongoose.model('Jam', jamSchema);

module.exports = JamModel