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
        const id = req.id;
        const foundUser = await UserModel.findById(id).populate('roles', '-__v -description');
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

        const foundUser = await UserModel.findOne({ username }).populate('roles', '-__v -description');

        if (!foundUser){
            return res.status(409).send({ message: "User not found"});
        }

        const { password, ...userResponse } = foundUser._doc;

        return res.send(userResponse);
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

        const foundUser = await UserModel.findById(id).populate('roles', '-__v -description');

        if (!foundUser){
            return res.status(409).send({ message: "User not found"});
        }
        
        const { password, ...userResponse } = foundUser._doc;
        return res.send(userResponse);
    } catch {
        res.status(500).send({ message: "Error" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const username = req.params.username;
        const user = req.body;
        console.log(user);

        const updatedUser = await UserModel.findOneAndUpdate({ username }, {$set: user}, { new: true }).populate('roles', '-__v -description');
        console.log(updatedUser._doc);
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        const { password, ...userResponse } = updatedUser._doc;

        res.send(userResponse);
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
        const foundUsers = await UserModel.find().populate('roles', '-__v -description');
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

exports.updatePassword = async (req, res) => {
    try {
        const username = req.body.username;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        const user = await UserModel.findOne({username});
        const isPasswordCorrect = authUtils.comparePasswords(currentPassword, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(410).send({ message: 'Incorrect current password.' });
        }

        if(currentPassword == newPassword){
            return res.status(409).send({ message: "Current password and new password can't be the same." });
        }

        user.password = authUtils.hashPassword(newPassword);
        user.save();
        res.send({ message: "Password reset successful"});

    } catch (err){
        res.status(500).send({message: "Server error"});
    }
};