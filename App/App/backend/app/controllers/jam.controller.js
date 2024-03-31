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


exports.removeSitefromJam = async (req, res) => {

}