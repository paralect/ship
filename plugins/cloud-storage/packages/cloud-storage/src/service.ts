import {
  CopyObjectCommand,
  type CopyObjectCommandOutput,
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  GetObjectCommand,
  type GetObjectOutput,
  type PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { readFile } from 'node:fs/promises';

export interface BackendFile {
  filepath: string;
  mimetype?: string | null;
  originalFilename?: string | null;
  newFilename: string;
  size: number;
}

type CamelCaseKey<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCaseKey<P3>}`
  : S extends `${infer P1}${infer P2}`
    ? `${Lowercase<P1>}${CamelCaseKey<P2>}`
    : Lowercase<S>;

type ToCamelCase<T> = {
  [K in keyof T as CamelCaseKey<string & K>]: T[K] extends object ? ToCamelCase<T[K]> : T[K];
};

function toCamelCase<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => toCamelCase(item)) as T;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const camelKey = key.replace(/[-_]([a-z])/gi, (_, c) => c.toUpperCase());
    const lowered = camelKey.charAt(0).toLowerCase() + camelKey.slice(1);
    result[lowered] = typeof value === 'object' ? toCamelCase(value) : value;
  }
  return result as T;
}

type UploadOutput = ToCamelCase<{ Location: string; Bucket: string; Key: string }>;

export class CloudStorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.CLOUD_STORAGE_BUCKET || '';

    const forcePathStyle = process.env.CLOUD_STORAGE_FORCE_PATH_STYLE !== 'false';

    this.client = new S3Client({
      forcePathStyle,
      region: process.env.CLOUD_STORAGE_REGION || 'us-east-1',
      endpoint: process.env.CLOUD_STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUD_STORAGE_SECRET_ACCESS_KEY || '',
      },
    });
  }

  getFileKey(url: string | null | undefined): string {
    if (!url) return '';

    const decodedUrl = decodeURI(url);
    const { pathname } = new URL(decodedUrl);

    return pathname.substring(1);
  }

  async upload(fileName: string, file: BackendFile): Promise<UploadOutput> {
    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      ContentType: file.mimetype as string,
      Body: await readFile(file.filepath),
      Key: fileName,
      ACL: 'private',
    };

    const multipartUpload = new Upload({ client: this.client, params });

    return multipartUpload.done().then((value) => toCamelCase<UploadOutput>(value as unknown as UploadOutput));
  }

  async uploadPublic(fileName: string, file: BackendFile): Promise<UploadOutput> {
    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      ContentType: file.mimetype as string,
      Body: await readFile(file.filepath),
      Key: fileName,
      ACL: 'public-read',
    };

    const multipartUpload = new Upload({ client: this.client, params });

    return multipartUpload.done().then((value) => toCamelCase<UploadOutput>(value as unknown as UploadOutput));
  }

  async uploadBuffer(fileName: string, body: Buffer | Uint8Array, contentType: string): Promise<UploadOutput> {
    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      ContentType: contentType,
      Body: body,
      Key: fileName,
    };

    const multipartUpload = new Upload({ client: this.client, params });

    return multipartUpload.done().then((value) => toCamelCase<UploadOutput>(value as unknown as UploadOutput));
  }

  getSignedDownloadUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });

    return getSignedUrl(this.client, command, { expiresIn: 1800 });
  }

  getObject(fileName: string): Promise<GetObjectOutput> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });

    return this.client.send(command);
  }

  async copyObject(filePath: string, copyFilePath: string): Promise<ToCamelCase<CopyObjectCommandOutput>> {
    const command = new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: encodeURI(`${this.bucket}/${copyFilePath}`),
      Key: filePath,
    });

    return this.client.send(command).then((value) => toCamelCase(value));
  }

  async deleteObject(fileName: string): Promise<ToCamelCase<DeleteObjectCommandOutput>> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });

    return this.client.send(command).then((value) => toCamelCase(value));
  }
}
