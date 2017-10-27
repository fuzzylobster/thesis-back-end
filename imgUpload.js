'use strict';
require('dotenv').config();
const storage = require('@google-cloud/storage');
const fs = require('fs')

const gcs = storage({
  projectId: process.env.CLOUD_ID,
  keyFilename: process.env.CLOUD_FILE
});

const bucketName = process.env.CLOUD_ID
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + process.env.CLOUD_ID + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGcs = (req, res, next) => {
  if(!req.file) return next();

  // Can optionally add a path to the gcsname below by concatenating it before the filename
  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
}

module.exports = ImgUpload;
