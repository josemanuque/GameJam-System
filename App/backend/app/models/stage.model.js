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
            type: Date
        },
        pitchPreviewDeliveryDate: {
            type: Date
        },
        pitchDeliveryDate: {
            type: Date
        },
        pitchTestDate: {
            type: Date
        },
        judgeDeliveryDate: {
            type: Date
        }
    },
    {
        versionKey: false,
    }
)

const StageModel = mongoose.model('Stage', stageSchema);

module.exports = StageModel