const siteModel = require('../models/site.model');

/**
 * Creates a site in DB
 * @param {*} req: site object (name, country, array of team object id)
 * @param {*} res 
 */
exports.addSite = async (req, res) => {
    try {
        const siteData = req.body;
        site = new siteModel(site);
    
    
        await siteModel.save(site);
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
        const site = req.body;

        await siteModel.deleteOne(site);
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
        const country = req.body.country;

        const foundSites = await siteModel.findAll({ country });
    
        return res.send(foundSites.map(site => {
            return { name: site.name, country: site.country }
        }));
    }
    catch(error){
        return res.status(409).send({ message: "Error"});
    }
}