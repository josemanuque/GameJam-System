const NotificationModel = require ('../models/notification.model');

/**
 * Creates a new notification of type "joinTeam" for a user
 */

exports.createNotification = async (req, res) => {
    try {
        const notificationReq = {
            username: req.body.username,
            message: req.body.message,
            team: req.body.team,
            type: req.body.type
        };
        const notification = new NotificationModel(notificationReq);
        await notification.save();
        res.send(notification);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
}

/**
 * Gets all notifications for a user
 */

exports.getNotifications = async (req, res) => {
    try {
        const username = req.params.username;
        const notifications = await NotificationModel.find({ username }).populate({
            path: 'team',
            populate: {
                path: 'members',
                select: 'username'
            }
        });
        if(!notifications) {
            return res.status(404).send({ message: 'Notifications not found' });
        }
        res.send(notifications);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
}

/**
 * Deletes a notification
 */
exports.deleteNotification = async (req, res) => {
    try {
        const id = req.params.id;
        const notification = await NotificationModel.findByIdAndDelete(id);
        if(!notification) {
            return res.status(404).send({ message: 'Notification not found' });
        }
        res.send({ message: 'Notification removed' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
}

/**
 * Deletes all notifications for a user
 */
exports.clearNotifications = async (req, res) => {
    try {
        const username = req.body.username;
        const notifications = await NotificationModel.deleteMany({ username });
        if(!notifications) {
            return res.status(404).send({ message: 'Notifications not found' });
        }
        res.send({ message: 'Notifications cleared' });
    }
    catch(err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
}