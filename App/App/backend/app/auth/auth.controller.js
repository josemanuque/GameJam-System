const authUtils = require('./auth.fachade');
const UserModel = require('../models/user.model');
const OTPModel = require('../models/otp.model');
const emailUtils = require('../utils/emailUtils');
const roleController = require('../controllers/role.controller');

SECRET_KEY = process.env.SECRET_KEY;
KEY_EXPIRES_IN = process.env.KEY_EXPIRES_IN;

exports.register = async (req, res) => {
    try {
        const userReq = {
            username: req.body.username,
            email: req.body.email,
            password: authUtils.hashPassword(req.body.password),
            phoneNumber: req.body.phoneNumber
        };

        const defaultRoleID = await roleController.getDefaultRoleID();
        userReq.roles = [defaultRoleID];

        const user = new UserModel(userReq);
        await user.save();

        const resUser = {
            message: "Logged in",
            email: user.email,
            username: user.username,
            roles: ["Jammer"]
        };

        const accessToken = authUtils.generateAccessToken(resUser, SECRET_KEY, KEY_EXPIRES_IN);

        resUser.accessToken = accessToken;
        res.send(resUser);

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Email already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

exports.login = async (req, res) => {
    const userReq = {
        email: req.body.email,
        password: req.body.password
    };
    
    try {
        const foundPerson = await UserModel.findOne({ email: userReq.email });
        if (!foundPerson) {
            // username doesn't exist
            return res.status(409).send({ message: 'Authentication failed' });
        }

        const isPasswordCorrect = authUtils.comparePasswords(userReq.password, foundPerson.password);

        if (!isPasswordCorrect) {
            return res.status(409).send({ message: 'Authentication failed' });
        }
        
        const userRoles = await roleController.getRoleNamesFromIDs(foundPerson.roles);
        const user = {
            message: "Logged in",
            email: userReq.email,
            roles: userRoles
        };
        const accessToken = authUtils.generateAccessToken(user, SECRET_KEY, KEY_EXPIRES_IN);

        user.accessToken = accessToken;
        res.send(user);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }

};

exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await UserModel.findOne({email});
        if(!user) {
            return res.status(409).send({ message: "Error changing password" });
        }
        
        const existingOTP = await OTPModel.findOne({ userID: user._id });
        if(existingOTP){
            await existingOTP.deleteOne();
        }
        const resetOTP = authUtils.generateOTP();
        const hashedOTP = authUtils.hashPassword(resetOTP);

        const otpEntry = {
            userID: user._id, 
            resetOTP: hashedOTP
        }
        const otpObject = new OTPModel(otpEntry);
        otpObject.save();
        emailUtils.sendEmailTemplate(email, "Reset Password", 'forgotPasswordMail.html', resetOTP);
        //console.log(resetOTP);
        res.send({ message: "Success" });
    }
    catch (err) {
        res.send({ message: err });
    }
};

exports.resetPassword = async (req, res) => {
    const email = req.body.email;
    const OTP = req.body.OTP;
    const newPassword = req.body.password;

    try {
        const user = await UserModel.findOne({email});
        if (!user){
            return res.status(400).send({ message: "Invalid email or OTP"});
        }
        const otpEntry = await OTPModel.findOne({userID: user._id});
        if (!otpEntry){
            return res.status(400).send({ message: "Invalid email or OTP"});
        }

        const isOTPCorrect = authUtils.comparePasswords(OTP, otpEntry.resetOTP);
        if(!isOTPCorrect){
            return res.status(400).send({ message: "Incorrect OTP" });
        }
        user.password = authUtils.hashPassword(newPassword);
        await otpEntry.deleteOne();
        user.save();
        res.send({ message: "Password reset successful"});

    } catch (err){
        res.send({ message: err});
    }
};

