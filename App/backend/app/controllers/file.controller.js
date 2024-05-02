const FileModel = require ('../models/file.model');
const fs = require('fs');

/**
 * Creates a new file metadata entry in the database
 */

exports.uploadFile = async (req, res) => {
    try {
        // Extract metadata from the request object
        const metadata = {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            date: new Date()
        };
        // Save metadata to MongoDB using Mongoose
        const savedFile = await FileModel.create(metadata);

        // Handle success
        res.status(200).json({ message: 'File uploaded successfully', metadata: savedFile });
    } catch (error) {
        // Handle database error or other errors
        console.error('Error uploading file:', error);
        fs.unlinkSync(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });
        res.status(500).json({ message: 'Internal server error' });
        
    }
};

/**
 * Retrieves a file from the database
 */
exports.getFile = async (req, res) => {
    try {
        const file = await FileModel.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        const filePath = file.path;
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Error accessing file:', err);
                return res.status(404).json({ message: 'File not found' });
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                const contentType = 'application/pdf'; // Adjust according to the file type
                res.set('Content-Type', contentType);
                res.send(data);
            });
        });
    } catch (error) {
        console.error('Error getting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


/**
 * Deletes a file from the database
 */
exports.deleteFile = async (req, res) => {
    try {
        const file = await FileModel.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        const filePath = file.path;
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            await FileModel.deleteOne(file);
            res.status(200).json({ message: 'File deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Updates a file from the database
 */
exports.updateFile = async (req, res) => {
    try {
        const file = await FileModel.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        const filePath = file.path;
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const metadata = {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                date: new Date()
            };
            const updatedFile = await FileModel.findByIdAndUpdate(req.params.id, metadata, { new: true });
            res.status(200).json({ message: 'File updated successfully', metadata: updatedFile });
        });
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
