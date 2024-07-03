import {
  CompleteMultipartUploadCommandOutput,
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { PutObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { File } from '@koa/multer';

import { caseUtil } from 'utils';

import config from 'config';

import { ToCamelCase } from 'types';

import * as helpers from './cloud-storage.helper';

const client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: 'us-east-1', // To successfully create a new bucket, this SDK requires the region to be us-east-1
  endpoint: config.CLOUD_STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: config.CLOUD_STORAGE_ACCESS_KEY_ID ?? '',
    secretAccessKey: config.CLOUD_STORAGE_SECRET_ACCESS_KEY ?? '',
  },
});
const bucket = config.CLOUD_STORAGE_BUCKET;

type UploadOutput = ToCamelCase<CompleteMultipartUploadCommandOutput>;

const upload = async (fileName: string, file: File): Promise<UploadOutput> => {
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
    ACL: 'private',
  };

  const multipartUpload = new Upload({
    client,
    params,
  });

  return multipartUpload.done().then((value) => caseUtil.toCamelCase<UploadOutput>(value));
};

const uploadPublic = async (fileName: string, file: File): Promise<UploadOutput> => {
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
    ACL: 'public-read',
  };

  const multipartUpload = new Upload({
    client,
    params,
  });

  return multipartUpload.done().then((value) => caseUtil.toCamelCase<UploadOutput>(value));
};

const getSignedDownloadUrl = (fileName: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  return getSignedUrl(client, command, { expiresIn: 1800 });
};

const getObject = (fileName: string): Promise<GetObjectOutput> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  return client.send(command);
};

type CopyOutput = ToCamelCase<CopyObjectCommandOutput>;

const copyObject = async (filePath: string, copyFilePath: string): Promise<CopyOutput> => {
  const command = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: encodeURI(`${bucket}/${copyFilePath}`),
    Key: filePath,
  });

  return client.send(command).then((value) => caseUtil.toCamelCase<CopyOutput>(value));
};

type DeleteOutput = ToCamelCase<DeleteObjectCommandOutput>;

const deleteObject = async (fileName: string): Promise<DeleteOutput> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  return client.send(command).then((value) => caseUtil.toCamelCase<DeleteOutput>(value));
};

export default Object.assign(helpers, {
  upload,
  uploadPublic,
  getObject,
  copyObject,
  deleteObject,
  getSignedDownloadUrl,
});
