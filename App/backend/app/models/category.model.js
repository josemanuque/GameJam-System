const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        nameEng: {
            type: String, required: true, unique: true, trim: true
        },
        descriptionEng: {
            type: String, required: true, trim: true
        },
        manualEng: {
            data: String
        },
        nameSpa: {
            type: String, required: true, unique: true, trim: true
        },
        descriptionSpa: {
            type: String, required: true, trim: true
        },
        manualSpa: {
            data: String
        },
        namePort: {
            type: String, required: true, unique: true, trim: true
        },
        descriptionPort: {
            type: String, required: true, trim: true
        },
        manualPort: {
            data: String
        }
    },
    {
        versionKey: false,
    }
);

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
