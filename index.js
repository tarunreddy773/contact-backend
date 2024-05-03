import express from 'express';
import db from './db.js';
import multer from 'multer';
import csv from 'csvtojson';
import User from './models/user.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
 res.send('server is running');
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
   var data = req.file;

   var csvData = [];

   await csv()
     .fromFile(data.path)
     .then(async (response) => {
       for (let i = 0; i < response.length; i++) {
         csvData.push({
           name: response[i].Name,
           email: response[i].Email,
           mobile: response[i].Mobile,
         });
       }
       await User.insertMany(csvData);
     });

   res.status(200).json({ message: 'file uploaded successfully' });
 } catch (err) {
   res.status(500).json({ message: 'error occurred while uploading file', error: err.message });
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




app.listen(3000, () => {
 console.log('Express server initialized');
});