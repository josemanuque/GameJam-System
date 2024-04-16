const JamModel = require('../models/jam.model');

/**
 * Creates a new Game Jam
 * @param {*} req 
 * @param {*} res 
 */
exports.createJam = async (req, res) => {
    try {
        const jamReq = {
            title: req.body.title,
            description: req.body.description,
            startingDate: req.body.startingDate,
            endingDate: req.body.endingDate,
            theme: req.body.theme
        };
        const jam = new JamModel(jamReq);
        await jam.save();
        res.send({ message: "Jam created"});

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Jam already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

exports.removeJam = async (req, res) => {
    try {
        const jamID = req.params.id
        
        const deletedJam = await JamModel.findByIdAndDelete(jamID);
        if(!deletedJam){
            return res.status(404).send({ message: "Jam doesn't exist" });
        }
        res.send({ message: "Jam deleted"});

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};

exports.removeSiteFromJam = async (req, res) => {
    try {
        const jamID = req.body.jamID;
        const siteID = req.body.siteID;

        const jam = await JamModel.findById({ jamID });

        if(!jam){
            return res.status(404).send({ message: "Invalid Jam ID" });
        }

        jam.sites = jam.sites.filter(value => !value.equals(siteID));
        await jam.save();

        res.send({ message: "Site removed from Jam" });
    } catch(err){
        console.log(err);
        res.status(500).send({ message: "Server error" })
    }
};


exports.addSiteToJam = async (req, res) => {
    try {
        const jamID = req.body.jamID;
        const siteID = req.body.siteID;

        const jam = await JamModel.findById({ jamID });

        if(!jam){
            return res.status(404).send({ message: "Invalid Jam ID" });
        }

        jam.sites.push(siteID);
        await jam.save();

        res.send({ message: "Site added to Jam" });
    } catch(err){
        console.log(err);
        res.status(500).send({ message: "Server error" })
    }
};

exports.getJams = async (req, res) => {
    try {
        const jams = await JamModel.find();
        res.send({jams});
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};

exports.getJam = async (req, res) => {
    try {
        const jamID = req.params.id;
        const jam = await JamModel.findById(jamID);
        if(!jam){
            return res.status(404).send({ message: "Jam not found" });
        }
        res.send(jam);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};

exports.updateJam = async (req, res) => { 
    try {
        const jamID = req.params.id;
        const jamReq = req.body;
        const jam = await JamModel.findByIdAndUpdate(jamID, jamReq, {new: true});
        if(!jam){
            return res.status(404).send({ message: "Jam not found" });
        }
        res.send({ message: "Jam updated" });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};