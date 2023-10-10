import { File } from '@koa/multer';
import aws from 'aws-sdk';

import config from 'config';

const storage = new aws.S3(config.cloudStorage);
const Bucket = config.cloudStorage.bucket;

function upload(fileName: string, file: File) {
  const uploadParameters = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
    ACL: 'private',
  };

  return storage.upload(uploadParameters).promise();
}

function uploadPublic(fileName: string, file: File) {
  const uploadParameters = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
    ACL: 'public-read',
  };

  return storage.upload(uploadParameters).promise();
}

function getSignedDownloadUrl(fileName: string) {
  const params = {
    Bucket,
    Key: fileName,
    Expires: 1800,
  };

  return storage.getSignedUrl('getObject', params);
}

function getObject(fileName: string) {
  const downloadParameters = {
    Bucket,
    Key: fileName,
  };

  return storage.getObject(downloadParameters).promise();
}

function copyObject(filePath: string, copyFilePath: string) {
  const parameters = {
    Bucket,
    CopySource: encodeURI(`${Bucket}/${copyFilePath}`),
    Key: filePath,
  };

  return storage.copyObject(parameters).promise();
}

function deleteObject(fileName: string) {
  const parameters = {
    Bucket,
    Key: fileName,
  };

  return storage.deleteObject(parameters).promise();
}

export default {
  upload,
  uploadPublic,
  getObject,
  copyObject,
  deleteObject,
  getSignedDownloadUrl,
};
