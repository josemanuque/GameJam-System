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
            type: Date, required: true
        },
        endingDate: {
            type: Date, required: true
        },
        buildDeliveryDate: {
            type: Date, required: true
        },
        pitchPreviewDeliveryDate: {
            type: Date, required: true
        },
        pitchDeliveryDate: {
            type: Date, required: true
        },
        pitchTestDate: {
            type: Date, required: true
        },
        judgeDeliveryDate: {
            type: Date, required: true
        }
    },
    {
        versionKey: false,
    }
)

const StageModel = mongoose.model('Stage', stageSchema);

module.exports = StageModel