require("dotenv").config()
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporterGmail = async () => {
    try {
        const oauth2Client = new OAuth2(
            process.env.MAIL_CLIENT_ID,
            process.env.MAIL_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.MAIL_REFRESH_TOKEN,
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.log("*ERR: ", err)
                    reject();
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.USER_EMAIL,
                accessToken,
                clientId: process.env.MAIL_CLIENT_ID,
                clientSecret: process.env.MAIL_CLIENT_SECRET,
                refreshToken: process.env.MAIL_REFRESH_TOKEN,
            },
        });
        return transporter;
    } catch (err) {
        return err
    }
};


const sendEmail = async(to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to,
            subject,
            text,
        }
        let emailTransporter = await createTransporterGmail();
        await emailTransporter.sendMail(
            mailOptions, 
            (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
            } else {
                console.log('Email Sent:', info.response);
            }
        });
    } catch (err) {
        console.log("ERROR: ", err)
    }    
};

module.exports = { sendEmail }