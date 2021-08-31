const aws = require('aws-sdk');
const config = require('config');

const storage = new aws.S3(config.cloudStorage);
const Bucket = config.cloudStorage.bucket;

function upload(fileName, file) {
  const uploadParameters = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
  };

  return new Promise((res, rej) => {
    storage.upload(uploadParameters, (error, data) => {
      return error ? rej(error) : res(data);
    });
  });
}

function getSignedDownloadUrl(fileName) {
  const params = {
    Bucket,
    Key: fileName,
    Expires: 1800,
  };

  return storage.getSignedUrl('getObject', params);
}

function getObject(fileName) {
  const downloadParameters = {
    Bucket,
    Key: fileName,
  };

  return new Promise((res, rej) => {
    storage.getObject(downloadParameters, (error, data) => {
      return error ? rej(error) : res(data);
    });
  });
}

function deleteObject(fileName) {
  const parameters = {
    Bucket,
    Key: fileName,
  };

  return new Promise((res, rej) => {
    storage.deleteObject(parameters, (error, data) => {
      return error ? rej(error) : res(data);
    });
  });
}

module.exports = {
  upload,
  getObject,
  deleteObject,
  getSignedDownloadUrl,
};
