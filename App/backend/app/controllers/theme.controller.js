const ThemeModel = require('../models/theme.model');

exports.createTheme = async (req, res) => {
    try {
        const themeReq = {
            nameEng: req.body.nameEng,
            descriptionEng: req.body.descriptionEng,
            nameSpa: req.body.nameSpa,
            descriptionSpa: req.body.descriptionSpa,
            namePort: req.body.namePort,
            descriptionPort: req.body.descriptionPort,
        };

        if (req.pdfs) {
            if (req.pdfs['manualEng']) {
                themeReq.manualEng = req.pdfs['manualEng'];
            }
            if (req.pdfs['manualSpa']) {
                themeReq.manualSpa = req.pdfs['manualSpa'];
            }
            if (req.pdfs['manualPort']) {
                themeReq.manualPort = req.pdfs['manualPort'];
            }
        }
        const theme = new ThemeModel(themeReq);
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
        const themeData = req.body;

        if (req.pdfs){
            if (req.pdfs['manualEng']) {
                themeData.manualEng = req.pdfs['manualEng'];
            }
            if (req.pdfs['manualSpa']) {
                themeData.manualSpa = req.pdfs['manualSpa'];
            }
            if (req.pdfs['manualPort']) {
                themeData.manualPort = req.pdfs['manualPort'];
            }
        }

        const updatedTheme = await ThemeModel.findByIdAndUpdate(id, themeData, { new: true });

        if (!updatedTheme) {
            return res.status(404).send({ message: "Theme not found" });
        }
        res.send({ message: "Theme updated"});
    }
    catch {
        res.status(500).send({ message: "Server error" });
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

exports.getThemes = async (req, res) => {
    try {
        console.log('Getting themes')
        const themes = await ThemeModel.find();
        res.send(themes);
    } catch (error) {
        return res.status(404).json({ message: 'No themes exist' });
    }
}

