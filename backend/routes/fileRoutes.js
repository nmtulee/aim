import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';

const fileRoutes = express.Router();
const uploadDir = 'files';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isPDF = file.mimetype === 'application/pdf';
  if (isPDF) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};


const upload = multer({ storage, fileFilter });
const uploadSinglePDF = upload.single('pdf'); // use 'pdf' as field name

// Upload PDF
fileRoutes.post('/', (req, res) => {
  uploadSinglePDF(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).json({
        message: 'PDF uploaded successfully',
        file: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: 'No PDF file provided' });
    }
  });
});

// Delete PDF
fileRoutes.delete('/:filename', (req, res) => {
  const { filename } = req.params;
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, 'files', filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'PDF deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default fileRoutes;
