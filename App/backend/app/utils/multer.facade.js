const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueID = uuidv4();
        const originalExtension = file.originalname.split('.').pop();
        const newFilename = `${uniqueID}.${originalExtension}`;
        cb(null, newFilename);
    }
});

const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)){
        cb(new Error('Invalid file format. Only .png, .jpeg and .jpg files are allowed.'), false);
    } else {
        cb(null, true)
    }
};

const pdfFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)){
        cb(new Error('Invalid file format. Only .pdf files are allowed.'), false);
    } else {
        cb(null, true)
    }
}

const uploadImage = multer({
    storage, 
    fileFilter: imageFileFilter
});

const uploadPDF = multer({
    storage,
    fileFilter: pdfFileFilter
});

const uploadMultiplePDF = multer({
    storage,
    fileFilter: pdfFileFilter
}).fields([
    { name: 'manualEng', maxCount: 1 },
    { name: 'manualSpa', maxCount: 1 },
    { name: 'manualPort', maxCount: 1 }
]);


function handleImageUpload(req, res, next) {
    uploadImage.single('file')(req, res, (err) => {
        /* if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(400).send({ message: err.message });
        } else if (err) {
            return res.status(400).send({ message: err.message });
        } */
        next();
    });
}

function handlePDFUpload(req, res, next) {
    uploadPDF.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: err.message });
        } else if (err) {
            return res.status(400).send({ message: err.message });
        }
        next();
    });
}

function handleMultiplePDFUploads(req, res, next) {
    uploadMultiplePDF(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: err.message });
        } else if (err) {
            return res.status(400).send({ message: err.message });
        }
        next();
    });
}


module.exports = { handleImageUpload, handlePDFUpload, handleMultiplePDFUploads };