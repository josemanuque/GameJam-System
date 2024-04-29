const ThemeModel = require('../models/theme.model');
const fs = require('fs');

exports.createTheme = async (req, res) => {
    try {
        const EngPdf = fs.readFileSync(req.body.manualEng);
        const SpaPdf = fs.readFileSync(req.body.manualSpa);
        const PortPdf = fs.readFileSync(req.body.manualPort);

        const theme = new ThemeModel({
            nameEng: req.body.nameEng,
            descriptionEng: req.body.descriptionEng,
            manualEng: EngPdf,
            nameSpa: req.body.nameSpa,
            descriptionSpa: req.body.descriptionSpa,
            manualSpa: SpaPdf,
            namePort: req.body.namePort,
            descriptionPort: req.body.descriptionPort,
            manualPort: PortPdf
        });

        await theme.save();
        res.send({ message: "Theme created" });

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Theme already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

exports.updateTheme = async (req, res) => {
    try {
        const id = req.params.id;
        const theme = req.body;

        if (theme.manualEng) {
            theme.manualEng = fs.readFileSync(theme.manualEng);
        }
        if (theme.manualSpa) {
            theme.manualSpa = fs.readFileSync(theme.manualSpa);
        }
        if (theme.manualPort) {
            theme.manualPort = fs.readFileSync(theme.manualPort);
        }

        const updatedTheme = await ThemeModel.findByIdAndUpdate(id
            , theme
            , { new: true });

        if (!updatedTheme) {
            return res.status(404).send({ message: "Theme not found" });
        }
        res.send(updatedTheme);
    }
    catch {
        res.status(500).send({ message: "Error" });
    }
};

exports.removeTheme = async (req, res) => {
    try {
        const themeID = req.params.id
        
        const deletedTheme = await ThemeModel.findByIdAndDelete(themeID);
        if(!deletedTheme){
            return res.status(404).send({ message: "Theme doesn't exist" });
        }
        res.send({ message: "Theme deleted"});

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};