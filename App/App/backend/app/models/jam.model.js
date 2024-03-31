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
            type: String, required: true, trim: true
        },
        endingDate: {
            type: String, required: true, trim: true
        },
        theme : {
            type: String, required: true, trim: true
        },
        sites: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Site'
        }]
    },
    {
        versionKey: false,
    }
)

const JamModel = mongoose.model('Jam', jamSchema);

module.exports = JamModel