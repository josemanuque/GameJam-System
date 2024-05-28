const CategoryModel = require('../models/category.model');

exports.createCategory = async (req, res) => {
    try {
        const categoryReq = {
            nameEng: req.body.nameEng,
            descriptionEng: req.body.descriptionEng,
            nameSpa: req.body.nameSpa,
            descriptionSpa: req.body.descriptionSpa,
            namePort: req.body.namePort,
            descriptionPort: req.body.descriptionPort,
        };

        if (req.pdfs) {
            if (req.pdfs['manualEng']) {
                categoryReq.manualEng = req.pdfs['manualEng'];
            }
            if (req.pdfs['manualSpa']) {
                categoryReq.manualSpa = req.pdfs['manualSpa'];
            }
            if (req.pdfs['manualPort']) {
                categoryReq.manualPort = req.pdfs['manualPort'];
            }
        }

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
        const categoryData = req.body;

        if (req.pdfs){
            if (req.pdfs['manualEng']) {
                categoryData.manualEng = req.pdfs['manualEng'];
            }
            if (req.pdfs['manualSpa']) {
                categoryData.manualSpa = req.pdfs['manualSpa'];
            }
            if (req.pdfs['manualPort']) {
                categoryData.manualPort = req.pdfs['manualPort'];
            }
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true });

        if (!updatedCategory) {
            return res.status(404).send({ message: "Category not found" });
        }
        res.send({ message: "Site updated" });
    }
    catch {
        res.status(500).send({ message: "Server error" });
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