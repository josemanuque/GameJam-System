const GameModel = require('../models/game.model')

/**
 * Submits game info to db
 * @param {*} req 
 * @param {*} res 
 */
exports.submitGame = async (req, res) => {
    try {
        const gameReq = {
            title: req.body.title,
            description: req.body.description,
            teamID: req.body.teamID,
            buildLink: req.body.buildLink,
            youtubeLinkGameplay: req.body.youtubeLinkGameplay,
            youtubeLinkPitch: req.body.youtubeLinkPitch,
            categories: req.body.categories
        };
        if (req.photo) {
            gameReq.photo = {
                 data: req.photo.data
            };
        }

        const game = new GameModel(gameReq);
        await game.save();
        res.send({ message: "Game loaded" });

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Game already loaded' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

exports.getGame = async (req, res) => {
    try {
        const game = await GameModel.findOne({ teamID: req.params.teamID });
        if (!game) {
            res.status(404).send({ message: 'Game not found' });
        } else {
            res.send(game);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};