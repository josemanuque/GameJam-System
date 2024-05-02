const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
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
        date: {
            type: Date, default: Date.now
        }
    }
)

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel
