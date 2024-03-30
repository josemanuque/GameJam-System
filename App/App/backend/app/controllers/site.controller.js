const siteModel = require('../models/site.model');

exports.getSitesFromCountry = async (req, res) => {
    try {
        const country = req.body.country;

        const foundSites = siteModel.findAll({ country });
    
        return res.send(foundSites.map(site => site.name));
    }
    catch(error){
        return res.status(409).send({ message: "Error"});
    }
}

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

exports.removeSite = async (req, res) => {
    const site = req.body;

    siteModel.deleteOne(site);
}