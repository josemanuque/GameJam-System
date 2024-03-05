const authUtils = require('./auth.fachade');
const UserModel = require('./user.model');
const emailUtils = require('../utils/emailUtils');

SECRET_KEY = process.env.SECRET_KEY;
KEY_EXPIRES_IN = process.env.KEY_EXPIRES_IN;

exports.register = async (req, res) => {
    try {
        const userReq = {
            email: req.body.email,
            password: authUtils.hashPassword(req.body.password)
        };
        const user = new UserModel(userReq);
        await user.save();

        const resUser = {
            message: "logged in",
            email: user.email,
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
        email: req.params.email,
        password: req.params.password
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

        const user = {
            message: "logged in",
            email: userReq.email
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

        if (!user) {
            return res.status(409).send({ message: "Error changing password" });
        }

        emailUtils.sendEmail(email, "Reset Password", "Test");
        res.send({ message: "Success" });
    }
    catch (err) {
        res.send({ message: err });
    }
};