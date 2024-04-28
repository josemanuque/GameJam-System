const authUtils = require('./auth.fachade');
const UserModel = require('../models/user.model');
const OTPModel = require('../models/otp.model');
const emailUtils = require('../utils/emailUtils');
const roleController = require('../controllers/role.controller');

SECRET_KEY = process.env.SECRET_KEY;
KEY_EXPIRES_IN = process.env.KEY_EXPIRES_IN;

exports.register = async (req, res) => {
    try {
        let roles = req.body.roles;
        if (Array.isArray(roles) && roles.length > 0){
            roles = await roleController.getRoleIDs(roles);
        }
        else if(!roles || roles.length === 0){
            const defaultRoleID = await roleController.getDefaultRoleID();
            roles = [defaultRoleID];
        }
        
        const userReq = {
            name: req.body.name,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: authUtils.hashPassword(req.body.password),
            phone: req.body.phone,
            roles: roles,
            region: req.body.region,
            site: req.body.site,
        };


        const user = new UserModel(userReq);
        await user.save();

        const userRoles = await roleController.getRoleNamesFromIDs(userReq.roles);

        const resUser = {
            message: "Logged in",
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            username: user.username,
            roles: userRoles
        };

        const accessToken = authUtils.generateAccessToken(resUser, SECRET_KEY, KEY_EXPIRES_IN);

        resUser.accessToken = accessToken;
        res.send(resUser);

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Email or username already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

exports.login = async (req, res) => {
    const userReq = {
        username: req.body.username,
        password: req.body.password
    };
    
    try {
        const foundPerson = await UserModel.findOne({ username: userReq.username });
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
            name: foundPerson.name,
            lastname: foundPerson.lastname,
            username: foundPerson.username,
            email: foundPerson.email,
            phone: foundPerson.phone,
            roles: userRoles,
            region: foundPerson.region,
            site: foundPerson.site
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

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.status(401).send({ message: 'Token is null' });
    }
    try{
        const decodedToken = authUtils.verifyToken(token, SECRET_KEY);
        if(!decodedToken){
            return res.status(403).send({ message: 'Invalid token' });
        }
        req.username = decodedToken.username;
        next();
    }catch {
        return res.status(403).send({ message: 'Invalid token' });
    } 
}