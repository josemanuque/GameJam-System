const siteModel = require('../models/site.model');

/**
 * Creates a site in DB
 * @param {*} req: site object (name, country, array of team object id)
 * @param {*} res 
 */
exports.createSite = async (req, res) => {
    try {
        const siteData = req.body;
        const site = new siteModel(siteData);
    
    
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
}

/**
 * Deletes site if found
 * @param {*} req 
 * @param {*} res 
 */
exports.removeSite = async (req, res) => {
    try {
        const site = req.body.id;

        await siteModel.findByIdAndDelete(site);
        res.send({ message: "Side deleted successfully"});
    } catch {
        res.status(500).send({ message: 'Server error'});
    }
}

/**
 * Sends res with site name and country.
 * @param {*} req 
 * @param {*} res 
 */

exports.getSitesFromCountry = async (req, res) => {
    try {
        const country = req.params.country;

        const foundSites = await siteModel.findAll({ country });
    
        return res.send(foundSites.map(site => {
            return { name: site.name, country: site.country }
        }));
    }
    catch(error){
        return res.status(409).send({ message: "Error"});
    }
}