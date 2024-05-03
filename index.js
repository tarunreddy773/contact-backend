import express from 'express';
import db from './db.js';
import multer from 'multer';
import csv from 'csvtojson';
import User from './models/user.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is running');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const data = req.file;
    const csvData = await csv().fromFile(data.path);

    const userData = csvData.map(entry => ({
      name: entry.Name,
      email: entry.Email,
      mobile: entry.Mobile,
    }));

    await User.insertMany(userData);

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error occurred while uploading file', error: err.message });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: 'Error occurred while fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server initialized on port ${PORT}`);
});
