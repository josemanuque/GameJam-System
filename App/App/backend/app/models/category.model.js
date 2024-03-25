const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true, unique: true, trim: true
        },
        description: {
            type: String, required: true, trim: true
        }
    },
    {
        versionKey: false,
    }
)

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel