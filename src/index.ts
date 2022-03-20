import express, { json } from 'express';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import MahasiswaRouter from './routes';

if (!fs.existsSync(path.resolve('uploads/'))) {
  fs.mkdirSync(path.resolve('uploads/'), {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.resolve('uploads/'));
  },
  filename: function (_req, file, cb) {
    const [filename] = file.originalname.split('.');
    const ext = path.extname(file.originalname);
    const newFileName = `${filename}-${moment().unix()}${ext}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

async function main() {
  await mongoose.connect('mongodb://localhost:27017', {
    dbName: 'crud_law',
    autoIndex: true,
    autoCreate: true,
  });

  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(MahasiswaRouter);

  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'file_not_uploaded',
        error_description: 'File Tidak di upload',
      });
    }
    return res.json({
      message: 'File Berhasil Diunggah',
      detail: {
        originalname: file.originalname,
        newFileName: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  });

  app.listen(3020, () => {
    console.log('App start at port 3000');
  });
}

main();
