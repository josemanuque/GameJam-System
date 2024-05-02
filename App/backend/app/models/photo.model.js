const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
    {
        filename: {
            type: String, required: true
        },
        path: {
            type: String, required: true
        },
        size: {
            type: Number
        },
        dimensions: {
            width: {
                type: Number
            },
            height: {
                type: Number
            }
        },
        date: {
            type: Date, default: Date.now
        }
    }
)

const PhotoModel = mongoose.model('Photo', photoSchema);

module.exports = PhotoModel
