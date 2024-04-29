const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true, trim: true
        },
        priority: {
            type: String, required: true, trim: true
        },
        startingDate: {
            type: String, required: true, trim: true
        },
        endingDate: {
            type: String, required: true, trim: true
        },
        buildDeliveryDate: {
            type: String, trim: true
        },
        pitchPreviewDeliveryDate: {
            type: String, trim: true
        },
        pitchDeliveryDate: {
            type: String, trim: true
        },
        pitchTestDate: {
            type: String, trim: true
        },
        judgeDeliveryDate: {
            type: String, trim: true
        },
        demoDayDate: {
            type: String, trim: true
        }
    },
    {
        versionKey: false,
    }
)

const StageModel = mongoose.model('Stage', stageSchema);

module.exports = StageModel