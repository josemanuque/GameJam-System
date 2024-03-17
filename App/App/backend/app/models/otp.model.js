const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            unique: true, 
            ref: 'User'
        },
        resetOTP: {
            type: String
        },
        expiresAt: {
            type: Date,
            default: Date.now,
            expires: '900'
        }
    }
);

const OPTModel = mongoose.model('OTP', otpSchema);

module.exports = OPTModel;