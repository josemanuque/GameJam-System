const StageModel = require('../models/stage.model');

exports.createStage = async (req, res) => {
    try {
        const stageReq = {
            name: req.body.name,
            priority: req.body.priority,
            startingDate: req.body.startingDate ? new Date(req.body.startingDate) : undefined,
            endingDate: req.body.endingDate ? new Date(req.body.endingDate) : undefined,
            buildDeliveryDate: req.body.buildDeliveryDate ? new Date(req.body.buildDeliveryDate) : undefined,
            pitchPreviewDeliveryDate: req.body.pitchPreviewDeliveryDate ? new Date(req.body.pitchPreviewDeliveryDate) : undefined,
            pitchDeliveryDate: req.body.pitchDeliveryDate ? new Date(req.body.pitchDeliveryDate) : undefined,
            pitchTestDate: req.body.pitchTestDate ? new Date(req.body.pitchTestDate) : undefined,
            judgeDeliveryDate: req.body.judgeDeliveryDate ? new Date(req.body.judgeDeliveryDate) : undefined
        };

        const stage = new StageModel(stageReq);
        await stage.save();
        res.send({message: "Stage created successfully", _id: stage._id});

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


exports.getRemainingTime = async (req, res) => {
    try {
        const currentDate = new Date();
        const stage = await StageModel.findOne({
            startingDate: { $lte: currentDate },
            endingDate: { $gte: currentDate }
        });

        if (!stage) {
            res.status(404).send({ message: 'No current stage found' });
        } else {
            const remainingTimeMs = stage.endingDate - currentDate;
            const remainingTimeSec = Math.floor(remainingTimeMs / 1000);
            const remainingTimeMin = Math.floor(remainingTimeSec / 60);
            const remainingTimeHrs = Math.floor(remainingTimeMin / 60);
            const remainingTimeDays = Math.floor(remainingTimeHrs / 24);

            res.send({
                days: remainingTimeDays,
                hours: remainingTimeHrs % 24,
                minutes: remainingTimeMin % 60,
                seconds: remainingTimeSec % 60
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
};