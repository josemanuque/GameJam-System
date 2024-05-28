const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const uploadDirectory = path.resolve(__dirname, 'uploads');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: uploadDirectory,
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
        if (err) {
            return res.status(400).send({ message: err.message });
        } 

        if (req.file) {
            const imageBuffer = fs.readFileSync(req.file.path);
            const base64Image = imageBuffer.toString('base64');
            req.photo = {
                data: base64Image,
                contentType: req.file.mimetype
            };
            // Eliminar el archivo temporal después de convertirlo a Base64
            fs.unlinkSync(req.file.path);
        }
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
        }

        req.pdfs = {}
        if (req.files){
            for (const key in req.files){
                if (req.files[key][0]){
                    const fileBuffer = fs.readFileSync(req.files[key][0].path); 
                    const base64Pdf = fileBuffer.toString('base64');
                    req.pdfs[key] = {
                        data: base64Pdf,
                        contentType: req.files[key][0].mimetype
                    };
                    // Eliminar el archivo temporal después de convertirlo a Base64
                    fs.unlinkSync(req.files[key][0].path);
                }
            }
        }
        next();
    });
}


module.exports = { handleImageUpload, handlePDFUpload, handleMultiplePDFUploads };