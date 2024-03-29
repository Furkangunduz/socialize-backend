const multer = require('multer');
const path = require('path');
const fs = require('fs');

const up_folder = path.join(__dirname, '../../assets/userFiles');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(up_folder)) {
      fs.mkdirSync(up_folder, { recursive: true });
    }
    cb(null, up_folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const uploadFile = (req, res, next) => {
  upload.any()(req, res, function (err) {
    if (err) {
      return res.status(400).json(new ApiError(400, null, err.message));
    }

    if (!req.files || req.files.length === 0) {
      return next();
    }

    const file = req.files[0];
    const fileUrl = `${req.protocol}://${req.get('host')}/assets/userFiles/${file.filename}`;

    req.file = file;
    req.fileUrl = fileUrl;
    req.fileType = file.mimetype.split('/')[0];

    req.body.avatar = fileUrl;

    next();
  });
};

module.exports = { uploadFile };
