const CategoryModel = require('../models/category.model');

exports.createCategory = async (req, res) => {
    try {
        const categoryReq = {
            name: req.body.name,
            description: req.body.description
        };
        const category = new CategoryModel(categoryReq);
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
        const categories = await CategoryModel.find({}, 'name');
        const categoryNames = categories.map(category => {
            return { id: category._id, name: category.name }
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