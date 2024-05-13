const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
        
        name: {
            type: String, required: true, unique: true, trim: true
        },
        region: {
            type: String, required: true, trim: true
        },
        country: {
            type: String, required: true, trim: true
        },
        city: {
            type: String, required: true, trim: true
        },
        modality: {
            type: String, required: true, trim: true
        },
        teams: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Team'
        }],
        photo: {
            data: String
        }
});

const SiteModel = mongoose.model('Site', siteSchema);
    
module.exports = SiteModel