const StageModel = require('../models/stage.model');

exports.createStage = async (req, res) => {
    try {
        const stageReq = {
            name: req.body.name,
            priority: req.body.priority,
            startingDate: new Date(req.body.startingDate),
            endingDate: new Date(req.body.endingDate),
            buildDeliveryDate: new Date(req.body.buildDeliveryDate),
            pitchPreviewDeliveryDate: new Date (req.body.pitchPreviewDeliveryDate),
            pitchDeliveryDate: new Date(req.body.pitchDeliveryDate),
            pitchTestDate: new Date(req.body.pitchTestDate),
            judgeDeliveryDate: new Date(req.body.judgeDeliveryDate)
        };

        const stage = new StageModel(stageData);
        await stage.save();
        res.send({message: "Stage created successfully"});

    }catch(err) {
        if(err.code === 11000) {
            res.status(409).send({ message: 'Stage already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

exports.removeStage = async (req, res) => {
    try {
        const stageID = req.params.id
        
        const deletedStage = await StageModel.findByIdAndDelete(stageID);
        if(!deletedStage){
            return res.status(404).send({ message: "Stage doesn't exist" });
        }
        res.send({ message: "Stage deleted"});

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};

exports.updateStage = async (req, res) => { 
    try {
        const stageID = req.params.id;
        const stageData = req.body;

        const stage = await StageModel.findByIdAndUpdate(stageID, stageData, {new: true});
        if(!stage){
            return res.status(404).send({ message: "Stage not found" });
        }
        res.send({ message: "Stage updated" });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};

exports.getStages = async (req, res) => {
    try {
        const stages = await StageModel.find();
        res.send({stages});
    } catch(err) {
        res.status(500).send({ message: "Error getting stages"});
    }
};

exports.getStage = async (req, res) => {
    try {
        const id = req.params.id;

        const foundStage = await StageModel
            .findById(id)
            .exec();
        if(!foundStage){
            return res.status(409).send({ message: "Stage not found"});
        }
        res.send(foundStage);
    }
    catch(err) {
        res.status(500).send({ message: "Error getting stage"});
    }
    
};