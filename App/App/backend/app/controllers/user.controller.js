const UserModel = require('../models/user.model');
const roleController = require('./role.controller');
/**
 * Gets first 10 users found whose username match the prefix provided
 * @param {*} req  Username prefix
 * @param {*} res 
 * @returns top 10 users matching username prefix provided
 */
exports.getUsersFromPrefix = async (req, res) => {
    try {
        const userPrefix = req.body.username;
        const foundUsers = await UserModel.find({ username: new RegExp('^' + userPrefix + '.*', 'i') }).limit(10);
        const responseUserData = await Promise.all(foundUsers.map(async foundUser => {
            const userRoles = await roleController.getRoleNamesFromIDs(foundUser.roles);
            const userData = {
                username: foundUser.username,
                email: foundUser.email,
                roles: userRoles
            }
            return userData;
        }));
        
        res.send(responseUserData);
    } catch (err){
        console.log(err)
        res.status(500).send({ message: "Error getting users"})
    }
};

/**
 * Gets user data of a unique user being provided by the exact username. 
 * @param {*} req 
 * @param {*} res 
 * @returns user data
 */
exports.getUserByUsername = async (req, res) => {
    try {
        const username = req.body.username;

        const foundUser = await UserModel.findOne({ username });

        if (!foundUser){
            return res.status(409).send({ message: "User not found"});
        }
        const userRoles = await roleController.getRoleNamesFromIDs(foundUser.roles);
        const responseUserData = {
            username: foundUser.username,
            email: foundUser.email,
            roles: userRoles
        }
        return res.send({ responseUserData });
    } catch {
        res.status(500).send({ message: "Error" });
    }
}

/**
 * Gets user Object Id after being provided with username
 * @param {*} req 
 * @param {*} res 
 * @returns user Object Id
 */
exports.getUserId = async (req, res) => {
    try{
        const username = req.body.username;

        const foundUser = await UserModel.findOne({ username });

        if (!foundUser) {
            return res.status(409).send({ message: "Error" });
        }

        res.send(foundUser._id);
    } catch{
        return res.status(500).send({ message: "Server error"});
    }
}
