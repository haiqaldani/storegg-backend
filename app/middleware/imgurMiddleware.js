const fs = require('fs');
const imgurClient = require('../../config/imgur');

const uploadToImgur = async (req, res, next) => {
    try {
        // Check if there's a file to upload
        if (!req.file) {
            return next();
        }

        // Read the file as base64
        const base64Image = fs.readFileSync(req.file.path, { encoding: 'base64' });

        // Upload to Imgur
        const response = await imgurClient.upload({
            image: base64Image,
            type: 'base64',
        });

        // Delete local file after upload
        fs.unlinkSync(req.file.path);

        // Add Imgur URL to request
        req.imgurUrl = response.data.link;
        
        next();    } catch (error) {
        // Delete local file if upload fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        req.flash('alertMessage', `Error uploading image: ${error.message}`);
        req.flash('alertStatus', 'danger');
        return res.redirect('back');
    }
};

module.exports = { uploadToImgur };
