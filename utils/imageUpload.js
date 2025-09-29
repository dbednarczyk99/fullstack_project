// imageUpload.js
// Utility for handling image uploads using multer
// Defines separate upload configurations for user avatars and ad images

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const [name, ext] = file.originalname.split('.');
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

const uploadAvatar = multer({ 
  storage: storage,
  limits: { fileSize: 250 * 1024 }, // 250 kB
});

const uploadAdImage = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //  10 MB
});

module.exports = { 
  uploadAvatar,
  uploadAdImage,
};