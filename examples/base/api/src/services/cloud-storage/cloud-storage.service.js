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
    ACL: 'private',
  };

  return storage.upload(uploadParameters).promise();
}

function uploadPublic(fileName, file) {
  const uploadParameters = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
    ACL: 'public-read',
  };

  return storage.upload(uploadParameters).promise();
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

  return storage.getObject(downloadParameters).promise();
}

function copyObject(filePath, copyFilePath) {
  const parameters = {
    Bucket,
    CopySource: encodeURI(`${Bucket}/${copyFilePath}`),
    Key: filePath,
  };

  return storage.copyObject(parameters).promise();
}

function deleteObject(fileName) {
  const parameters = {
    Bucket,
    Key: fileName,
  };

  return storage.deleteObject(parameters).promise();
}

module.exports = {
  upload,
  uploadPublic,
  getObject,
  copyObject,
  deleteObject,
  getSignedDownloadUrl,
};
