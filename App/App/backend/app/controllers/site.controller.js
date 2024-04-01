const SiteModel = require('../models/site.model');
/**
 * Creates a site in DB
 * @param {*} req: site object (name, country, array of team object id)
 * @param {*} res 
 */
exports.createSite = async (req, res) => {
    try {
        const siteData = req.body;
        const site = new SiteModel(siteData);
    
    
        await site.save();
        siteData.message = "Side created successfully"
        res.send(siteData);
    }
    catch(err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Site already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

/**
 * Deletes site if found
 * @param {*} req 
 * @param {*} res 
 */
exports.removeSite = async (req, res) => {
    try {
        const site = req.body.id;

        const deletedSite = await SiteModel.findByIdAndDelete(site);
        if(!deletedSite){
            return res.status(404).send({ message: "Site doesn't exist" });
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
        if (foundSites.length === 0) {
            return res.status(409).send({ message: "No sites found" });
        }
        res.send(foundSites);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "Error getting sites"});
    }
};

exports.getSitesFromRegion = async (req, res) => {
    try {
        const region = req.params.region;

        const foundSites = await SiteModel.find({ region });
        if (foundSites.length === 0) {
            return res.status(409).send({ message: "No sites found" });
        }
        res.send(foundSites);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "Error getting sites"});
    }
};


exports.getSites = async (req, res) => {
    try {
        const sites = await SiteModel.find();
        res.send(sites);
    } catch (err) {
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
        if (!foundSite){
            return res.status(409).send({ message: "Site not found"});
        }
        console.log(foundSite);
        res.send(foundSite);
    }
    catch {
        res.status(500).send({ message: "Error getting site"});
    }
    
};