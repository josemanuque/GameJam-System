require("dotenv").config()
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
const path = require('path');

/**
 * @description Create a transporter for sending emails using Gmail
 * @deprecated
 */
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

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_APP_PASSWORD
        },
    });
    return transporter;
};

const sendEmail = async(to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to,
            subject,
            text,
        }
        let emailTransporter = await createTransporter();
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


const sendEmailTemplate = async(to, subject, template, OTP) => {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', template);
        const emailHTML = fs.readFileSync(templatePath, 'utf-8');
        const changePasswordOTP = OTP;
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to,
            subject,
            html: emailHTML.replace('${OTP}', changePasswordOTP),
        }
        let emailTransporter = await createTransporter();
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


module.exports = { sendEmail, sendEmailTemplate }