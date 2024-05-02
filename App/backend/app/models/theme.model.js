const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
    {
        nameEng: {
            type: String, required: true, unique: true, trim: true
        },
        descriptionEng: {
            type: String, required: true, trim: true
        },
        manualEng: {
            type: String, trim: true
        },
        nameSpa: {
            type: String, required: true, unique: true, trim: true
        },
        descriptionSpa: {
            type: String, required: true, trim: true
        },
        manualSpa: {
            type: String, trim: true
        },
        namePort: {
            type: String, required: true, unique: true, trim: true
        },
        descriptionPort: {
            type: String, required: true, trim: true
        },
        manualPort: {
            type: String, trim: true
        }
    },
    {
        versionKey: false,
    }
)

const ThemeModel = mongoose.model('Theme', themeSchema);

module.exports = ThemeModel