const CategoryModel = require('../models/category.model');
const fs = require('fs');

exports.createCategory = async (req, res) => {
    try {
        const EngPdf = fs.readFileSync(req.body.manualEng);
        const SpaPdf = fs.readFileSync(req.body.manualSpa);
        const PortPdf = fs.readFileSync(req.body.manualPort);

        const category = new CategoryModel({
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

        await category.save();
        res.send({ message: "Category created" });

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Category already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

exports.getCategoriesName = async (req, res) => {
    try {
        const categories = await CategoryModel.find({}, 'nameEng');
        const categoryNames = categories.map(category => {
            return { id: category._id, name: category.nameEng }
        });
        res.send({categoryNames});
    } catch (error) {
        return res.status(404).json({ message: 'No categories exist' });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const foundCategory = await CategoryModel.findById(id);

        if (!foundCategory) {
            return res.status(404).send({ message: "Category not found" });
        }
        res.send(foundCategory);
    }
    catch {
        res.status(500).send({ message: "Error" });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = req.body;

        if (category.manualEng) {
            category.manualEng = fs.readFileSync(category.manualEng);
        }
        if (category.manualSpa) {
            category.manualSpa = fs.readFileSync(category.manualSpa);
        }
        if (category.manualPort) {
            category.manualPort = fs.readFileSync(category.manualPort);
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(id
            , category
            , { new: true });

        if (!updatedCategory) {
            return res.status(404).send({ message: "Category not found" });
        }
        res.send(updatedCategory);
    }
    catch {
        res.status(500).send({ message: "Error" });
    }
};

exports.removeCategory = async (req, res) => {
    try {
        const categoryID = req.params.id
        
        const deletedCategory = await CategoryModel.findByIdAndDelete(categoryID);
        if(!deletedCategory){
            return res.status(404).send({ message: "Category doesn't exist" });
        }
        res.send({ message: "Category deleted"});

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error' });
    }
};