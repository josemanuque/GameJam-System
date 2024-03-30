const UserModel = require('../models/user.model');

/**
 * 
 * @param {*} req  
 * @param {*} res 
 * 
 * Gets first 10 users found whose username match the prefix provided
 */
exports.getUsersFromPrefix = async (req, res) => {
    const userPrefix = req.body.username;
    const foundUsers = await UserModel.find({ username: new RegExp('^' + userPrefix + '.*', 'i') }).limit(10);
    const responseUserData = foundUsers.map(foundUser => {
        const userData = {
            username: foundUser.username,
            email: foundUser.email,
            roles: foundUser.roles
        }
        return userData;
    });
    res.send(responseUserData);
};

exports.getUserByUsername = async (req, res) => {
    const username = req.body.username;

    const foundUser = await UserModel.findOne({ username });

    if (!foundUser){
        return res.status(409).send({ message: "User not found"});
    }
    const responseUserData = {
        username: foundUser.username,
        email: foundUser.email,
        roles: foundUser.roles
    }
    return res.send({ responseUserData });
}