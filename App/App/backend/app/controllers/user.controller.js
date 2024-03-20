const UserModel = require('../models/user.model');

exports.getUsersFromPrefix = async (req, res) => {
    const userPrefix = req.body.username;

    const foundUsers = await UserModel.find({ username: new RegExp('^' + userPrefix + '.*', 'i') }).limit(10);

    
    res.send(foundUsers);
};