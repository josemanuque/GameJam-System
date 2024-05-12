const fs = require('fs');

const ThemeModel = require('../models/theme.model');

exports.createTheme = async (req, res) => {
    try {
        const theme = new ThemeModel({
            nameEng: req.body.nameEng,
            descriptionEng: req.body.descriptionEng,
            //manualEng: req.files['manualEng'][0].path,
            nameSpa: req.body.nameSpa,
            descriptionSpa: req.body.descriptionSpa,
            //manualSpa: req.files['manualSpa'][0].path,
            namePort: req.body.namePort,
            descriptionPort: req.body.descriptionPort,
           // manualPort: req.files['manualPort'][0].path
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

/* exports.updateTheme = async (req, res) => {
    try {
        const id = req.params.id;
        const theme = req.body;

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
}; */

exports.removeTheme = async (req, res) => {
    try {
        const themeID = req.params.id
        
        const deletedTheme = await ThemeModel.findByIdAndDelete(themeID);
        if(!deletedTheme){
            return res.status(404).send({ message: "Theme doesn't exist" });
        }

        const filenames = [deletedTheme.manualEng, deletedTheme.manualSpa, deletedTheme.manualPort];
        
        filenames.forEach(filename => {
            if(filename){
                fs.unlinkSync(filename);
            }
        });

        res.send({ message: "Theme deleted"});

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};

exports.getThemesName = async (req, res) => {
    try {
        const themes = await ThemeModel.find({}, 'nameEng');
        const themesNames = themes.map(theme => {
            return { id: theme._id, name: theme.nameEng }
        });
        res.send({themesNames});
    } catch (error) {
        return res.status(404).json({ message: 'No themes exist' });
    }
};

exports.getTheme = async (req, res) => {
    try {
        const id = req.params.id;

        const foundTheme = await ThemeModel.findById(id);

        if (!foundTheme) {
            return res.status(404).send({ message: "Theme not found" });
        }
        res.send(foundTheme);
    }
    catch (error){
        console.log(error);
        res.status(500).send({ message: "Error" });
    }
};
