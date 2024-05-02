const PhotoModel = require ('../models/photo.model');
const fs = require('fs');
const sizeOf = require('image-size');

/**
 * Creates a new photo metadata entry in the database
 */

exports.uploadPhoto = async (req, res) => {
    try {
        const dimensions = sizeOf(req.file.path);
        // Extract metadata from the request object
        const metadata = {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            dimensions: { width: dimensions.width, height: dimensions.height }, // Adjust according to actual dimensions
            date: new Date()
        };
        // Save metadata to MongoDB using Mongoose
        const savedPhoto = await PhotoModel.create(metadata);

        // Handle success
        res.status(200).json({ message: 'Photo uploaded successfully', metadata: savedPhoto });
    } catch (error) {
        // Handle database error or other errors
        console.error('Error uploading photo:', error);
        fs.unlinkSync(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });
        res.status(500).json({ message: 'Internal server error' });
        
    }
};

/**
 * Retrieves a photo from the database
 */
exports.getPhoto = async (req, res) => {
    try {
        const photo = await PhotoModel.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }
        const photoPath = photo.path;
        fs.access(photoPath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Error accessing file:', err);
                return res.status(404).json({ message: 'Photo not found' });
            }

            fs.readFile(photoPath, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                const contentType = 'image/png'; // Adjust according to the file type
                res.set('Content-Type', contentType);
                res.send(data);
            });
        });
    } catch (error) {
        console.error('Error getting photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


/**
 * Deletes a photo from the database
 */
exports.deletePhoto = async (req, res) => {
    try {
        const photo = await PhotoModel.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }
        const photoPath = photo.path;
        fs.unlink(photoPath, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            await PhotoModel.deleteOne(photo);
            res.status(200).json({ message: 'Photo deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Updates a photo from the database
 */
exports.updatePhoto = async (req, res) => {
    try {
        const photo = await PhotoModel.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }
        const photoPath = photo.path;
        fs.unlink(photoPath, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const dimensions = sizeOf(req.file.path);
            const metadata = {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                dimensions: { width: dimensions.width, height: dimensions.height },
                date: new Date()
            };
            const updatedPhoto = await PhotoModel.findByIdAndUpdate(req.params.id, metadata, { new: true });
            res.status(200).json({ message: 'Photo updated successfully', metadata: updatedPhoto });
        });
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
