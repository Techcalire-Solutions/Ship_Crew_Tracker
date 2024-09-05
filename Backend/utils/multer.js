const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../employees/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4(); // Generate a UUID for uniqueness
    const fileExtension = path.extname(file.originalname);
    const newFilename = `${uniqueSuffix}${fileExtension}`;
    cb(null, newFilename);
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname));

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File format is not supported'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 10 MB in bytes
  fileFilter: fileFilter
});


module.exports = upload;
