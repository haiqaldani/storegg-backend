const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'temp');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
}).single('image');

// Export middleware function that handles multer errors
module.exports = {
  uploadMiddleware: (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        req.flash('alertMessage', `Upload error: ${err.message}`);
        req.flash('alertStatus', 'danger');
        return res.redirect('back');
      } else if (err) {
        req.flash('alertMessage', err.message);
        req.flash('alertStatus', 'danger');
        return res.redirect('back');
      }
      next();
    });
  }
};
