const authUtils = require('../auth/auth.fachade');
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
        const userPrefix = req.params.query;
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

exports.getMe = async (req, res) => {
    try {
        const username = req.username;
        const foundUser = await UserModel.findOne({ username });
        if (!foundUser){
            return res.status(409).send({ message: "User not found"});
        }

        const { password, ...userResponse } = foundUser._doc;
        return res.send(userResponse);
    }
    catch {
        res.status(500).send({ message: "Error" });
    }
}

/**
 * Gets user data of a unique user being provided by the exact username. 
 * @param {*} req 
 * @param {*} res 
 * @returns user data
 */
exports.getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;

        const foundUser = await UserModel.findOne({ username });

        if (!foundUser){
            return res.status(409).send({ message: "User not found"});
        }
        const userRoles = await roleController.getRoleNamesFromIDs(foundUser.roles);
        const responseUserData = {
            _id: foundUser._id,
            name: foundUser.name,
            lastname: foundUser.lastname,
            username: foundUser.username,
            email: foundUser.email,
            phone: foundUser.phone,
            roles: userRoles,
            region: foundUser.region,
            site: foundUser.site
        }
        return res.send(responseUserData);
    } catch {
        res.status(500).send({ message: "Error" });
    }
};

/**
 * Gets user data of a unique user being provided by the exact username. 
 * @param {*} req 
 * @param {*} res 
 * @returns user data
 */
exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;

        const foundUser = await UserModel.findById(id);

        if (!foundUser){
            return res.status(409).send({ message: "User not found"});
        }
        const userRoles = await roleController.getRoleNamesFromIDs(foundUser.roles);
        const responseUserData = {
            _id: foundUser._id,
            name: foundUser.name,
            lastname: foundUser.lastname,
            username: foundUser.username,
            email: foundUser.email,
            phone: foundUser.phone,
            roles: userRoles,
            region: foundUser.region,
            site: foundUser.site
        }
        return res.send(responseUserData);
    } catch {
        res.status(500).send({ message: "Error" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const username = req.params.username;
        const user = req.body;
        const roleNames = user.roles;
        if(roleNames){
            user.roles = await roleController.getRoleIDs(user.roles);
        }
        user.password = authUtils.hashPassword(user.password);
        const updatedUser = await UserModel.findOneAndUpdate({ username }, {$set: user}, { new: true });

        const updatedUserRoles = await roleController.getRoleNamesFromIDs(updatedUser.roles);
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        const responseUserData = {
            _id: updatedUser._id,
            name: updatedUser.name,
            lastname: updatedUser.lastname,
            username: updatedUser.username,
            email: updatedUser.email,
            password: updatedUser.password,
            phone: updatedUser.phone,
            roles: updatedUserRoles,
            region: updatedUser.region,
            site: updatedUser.site
        }
        res.send(responseUserData);
    }
    catch (err){
        console.log(err);
        res.status(500).send({ message: "Server error" });
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
};

exports.getUsers = async (req, res) => {
    try {
        const foundUsers = await UserModel.find();
        const responseUserData = await Promise.all(foundUsers.map(async foundUser => {
            const { password, ...userData } = foundUser._doc;
            return userData;
        }));
        
        res.send(responseUserData);
    } catch (err){
        console.log(err)
        res.status(500).send({ message: "Error getting users"})
    }
}