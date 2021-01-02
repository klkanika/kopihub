import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const gcs = new Storage({
  projectId: 'kopihub-app',
  keyFilename: './api/kopihub-app-47cd8392c2b3.json'
});

const bucketName = 'kopihub_uploads'
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename:any) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload:any;

ImgUpload = (req:any, res:any, next:any) => {
  if(!req.file) return next();
  // console.log('ImgUpload file',req.file)
  // Can optionally add a path to the gcsname below by concatenating it before the filename
  const gcsname = Date.now()+req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err:any) => {
    console.log('ImgUpload error',err)
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    console.log('ImgUpload success', gcsname)
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
}

export default ImgUpload;