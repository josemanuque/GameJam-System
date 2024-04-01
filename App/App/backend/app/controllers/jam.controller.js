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
            // category array not yet implemented
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
        const jamID = req.body.id
        
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

exports.removeSitefromJam = async (req, res) => {
    try {
        const jamID = req.body.jamID;
        const siteID = req.body.siteID;

        const jam = await JamModel.findById({ jamID });

        if(!jam){
            return res.status(404).send({ message: "Invalid Jam ID" });
        }

        jam.sites = jam.sites.filter(value => !value.equals(siteID));
        jam.save();
    } catch(err){
        console.log(err);
        res.status(500).send({ message: "Server error" })
    }
};