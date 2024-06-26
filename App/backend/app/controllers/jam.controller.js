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
            startingDate: new Date(req.body.startingDate),
            endingDate: new Date(req.body.endingDate),
            theme: req.body.theme,
            stages: req.body.stages,
        };
        const jam = new JamModel(jamReq);
        await jam.save();
        res.send({ message: "Jam created", _id: jam._id});

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
        const jam = await JamModel
            .findById(jamID)
            .populate('stages');
        if(!jam){
            return res.status(404).send({ message: "Jam not found" });
        }
        res.send(jam);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};

// exports.updateJam = async (req, res) => { 
//     try {
//         const jamID = req.params.id;
//         const jamReq = req.body;
//         const jam = await JamModel.findByIdAndUpdate(jamID, jamReq, {new: true});
//         if(!jam){
//             return res.status(404).send({ message: "Jam not found" });
//         }
//         res.send({ message: "Jam updated" });
//     } catch (err) {
//         console.log(err)
//         res.status(500).send({ message: 'Server error' });
//     }
// };

// exports.updateJam = async (req, res) => { 
//     try {
//         const jamID = req.params.id;
//         const jamReq = req.body;
//         console.log('jamReq:', jamReq); // log the request body

//         const jam = await JamModel.findById(jamID);
//         if(!jam){
//             return res.status(404).send({ message: "Jam not found" });
//         }

//         console.log('jam before update:', jam); // log the jam document before update

//         // Update the jam document
//         Object.assign(jam, jamReq);

//         console.log('jam after update:', jam); // log the jam document after update

//         // Save the updated document
//         await jam.save();

//         res.send({ message: "Jam updated" });
//     } catch (err) {
//         console.log(err)
//         res.status(500).send({ message: 'Server error' });
//     }
// };

const multer = require('multer');
const upload = multer();

// exports.updateJam = async (req, res) => { 
//     upload.none()(req, res, async (err) => {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).send({ message: 'Multer error' });
//         } else if (err) {
//             return res.status(500).send({ message: 'Unknown error' });
//         }

//         try {
//             const jamID = req.params.id;
//             const jamReq = req.body;
//             console.log('jamReq:', jamReq); // log the request body

//             const jam = await JamModel.findById(jamID);
//             if(!jam){
//                 return res.status(404).send({ message: "Jam not found" });
//             }

//             // Update the jam document
//             Object.assign(jam, jamReq);
//             console.log('jam after update:', jam); // log the jam document after update

//             // Save the updated document
//             await jam.save();
//             console.log('jam after save:', jam); // log the jam document after save

//             res.send({ message: "Jam updated" });
//         } catch (err) {
//             console.log(err)
//             res.status(500).send({ message: 'Server error' });
//         }
//     });
// };

exports.updateJam = async (req, res) => { 
    upload.none()(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).send({ message: 'Multer error' });
        } else if (err) {
            return res.status(500).send({ message: 'Unknown error' });
        }

        try {
            const jamID = req.params.id;
            const jamReq = req.body;

            const jam = await JamModel.findById(jamID);
            if(!jam){
                return res.status(404).send({ message: "Jam not found" });
            }

            // Update the jam document
            jam.set(jamReq);

            // Save the updated document
            await jam.save();

            res.send({ message: "Jam updated" });
        } catch (err) {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    });
};

exports.addStageToJam = async (req, res) => {
    try {
        const jamID = req.body.jamID;
        const stageID = req.body.stageID;


        const jam = await JamModel.findById(jamID);

        if(!jam){
            return res.status(404).send({ message: "Invalid Jam ID" });
        }

        jam.stages.push(stageID);
        await jam.save();
        res.send({ message: "Stage added to Jam" });
        
    } catch(err){
        console.log(err);
        res.status(500).send({ message: "Server error" })
    }
};

exports.removeStageFromJam = async (req, res) => {
    try {
        const jamID = req.params.jamID;
        const stageID = req.params.stageID;

        const jam = await JamModel.findById(jamID);

        if(!jam){
            return res.status(404).send({ message: "Invalid Jam ID" });
        }
        
        jam.stages = jam.stages.filter(value => !value.equals(stageID));
        
        await jam.save();

        res.send({ message: "Stage removed from Jam" });
    } catch(err){
        console.log(err);
        res.status(500).send({ message: "Server error" })
    }
}


exports.updateStagePriority = async (req, res) => {
    try {
        const jamID = req.body.jamID;
        const stages = req.body.stages;

        const jam = await JamModel.findById(jamID);

        if(!jam){
            return res.status(404).send({ message: "Invalid Jam ID" });
        }

        jam.stages = stages;
        await jam.save();
        res.send({ message: "Stage priority updated" });
        
    } catch(err){
        console.log(err);
        res.status(500).send({ message: "Server error" })
    }
}