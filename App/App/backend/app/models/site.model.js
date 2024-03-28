const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
        
        name: {
            type: String, required: true, unique: true, trim: true
        },
        country: {
            type: String, required: true, unique: true, trim: true
        }
});

const SiteModel = mongoose.model('Site', siteSchema);
    
module.exports = SiteModel