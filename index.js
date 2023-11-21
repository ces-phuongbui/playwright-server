const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files'), (req, res) => {
  try {
    const uploadedFiles = req.files;

    const savedFiles = uploadedFiles.map(file => ({
      fileName: file.filename,
    }));

    res.json({ success: true, files: savedFiles });
  } catch (error) {
    console.error('Error uploading files:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/images', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);

    const images = files.map(file => ({
      filename: file,
    }));

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});