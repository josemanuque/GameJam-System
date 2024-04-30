const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        username: {
            type: String, required: true, trim: true
        },
        message: {
            type: String, trim: true
        },
        team: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true
        },
        type: {
            type: String, required: true, trim: true
        }
    }
)

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel
