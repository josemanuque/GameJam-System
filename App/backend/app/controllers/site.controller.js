const fs = require('fs');

const SiteModel = require('../models/site.model');
/**
 * Creates a site in DB
 * @param {*} req: site object (name, country, array of team object id)
 * @param {*} res 
 */
exports.createSite = async (req, res) => {
    try {
        const siteReq = {
            name: req.body.name,
            region: req.body.region,
            country: req.body.country,
            city: req.body.city,
            modality: req.body.modality,
            teams: req.body.teams,
            photo: req.file.path
        };
        const site = new SiteModel(siteReq);
        await site.save();
        siteReq.message = "Side created successfully";
        res.send(siteReq);
    }catch(err) {
        if(err.code === 11000) {
            res.status(409).send({ message: 'Site already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
}};

/**
 * Deletes site if found
 * @param {*} req 
 * @param {*} res 
 */
exports.removeSite = async (req, res) => {
    try {
        const siteID = req.params.id;

        const deletedSite = await SiteModel.findByIdAndDelete(siteID);

        if(!deletedSite){
            return res.status(404).send({ message: "Site doesn't exist" });
        }

        const filePath = deletedSite.photo;
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }

        res.send({ message: "Side deleted successfully"});
    } catch {
        res.status(500).send({ message: 'Server error'});
    }
};

/**
 * Sends res with site name and country.
 * @param {*} req 
 * @param {*} res 
 */

exports.getSitesFromCountry = async (req, res) => {
    try {
        const country = req.params.country;

        const foundSites = await SiteModel.find({ country });
        if(foundSites.length === 0) {
            return res.status(409).send({ message: "No sites found" });
        }
        res.send({sites: foundSites});
    }
    catch(err) {
        console.log(err);
        res.status(500).send({ message: "Error getting sites"});
    }
};

exports.getSitesFromRegion = async (req, res) => {
    try {
        const region = req.params.region;

        const foundSites = await SiteModel.find({ region });
        if(foundSites.length === 0) {
            return res.status(409).send({ message: "No sites found" });
        }
        res.send({sites: foundSites});
    }
    catch(err) {
        console.log(err);
        res.status(500).send({ message: "Error getting sites"});
    }
};


exports.getSites = async (req, res) => {
    try {
        const sites = await SiteModel.find();
        res.send({sites});
    } catch(err) {
        res.status(500).send({ message: "Error getting sites"});
    }
};

exports.getSite = async (req, res) => {
    try {
        const id = req.params.id;

        const foundSite = await SiteModel
            .findById(id)
            .populate('teams')
            .exec();
        if(!foundSite){
            return res.status(409).send({ message: "Site not found"});
        }
        console.log(foundSite);
        res.send(foundSite);
    }
    catch(err) {
        res.status(500).send({ message: "Error getting site"});
    }
    
};

exports.updateSite = async (req, res) => {
    try {
        const siteID = req.params.id;
        const siteData = req.body;
            
        if (req.file) {
            const site = await SiteModel.findById(siteID);
            if (!site) {
                return res.status(404).send({ message: "Site not found" });
            }
            const originalFilePath = site.photo;

            const updatedSite = await SiteModel.findByIdAndUpdate(siteID, { ...siteData, photo: req.file.path }, { new: true });
            if(!updatedSite){
                return res.status(404).send({ message: "Jam not found" });
            }

            if(fs.existsSync(originalFilePath)){
                fs.unlinkSync(originalFilePath);
            }

        } else {
            const updatedSite = await SiteModel.findByIdAndUpdate(siteID, siteData, { new: true });
            if(!updatedSite){
                return res.status(404).send({ message: "Jam not found" });
            }
        }
        
        res.send({ message: "Site updated" });
    }
    catch(err) {
        console.log(err);
        res.status(500).send({ message: "Error updating site"});
    }
}