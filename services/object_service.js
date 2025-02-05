import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
import { 
  S3Client, 
  GetObjectCommand, 
  DeleteObjectCommand, 
} from '@aws-sdk/client-s3';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
});

const getObjectList = async (bucketName) => {
    try {
        const params = { Bucket: bucketName };
        const data = await s3Client.send(new ListObjectsCommand(params));

        if (!data.Contents) {
            return `No objects found in ${bucketName}`;
        }

        return data.Contents.map((object) => ({
            key: object.Key,
            size : object.Size,
            lastModified: object.LastModified,
        }));
    } catch (err) {
        console.log(`Error listing objects: ${err.message}`);
    }
};

const uploadObject = async (filePath, bucketName, key) => {
  try {
    const fileStream = fs.createReadStream(filePath);

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
      },
    });

    await upload.done();
    return `File uploaded successfully to ${bucketName}/${key}`;
  } catch (err) {
    throw new Error(`Error uploading file: ${err.message}`);
  }
};

const downloadObject = async (bucketName, key, downloadPath) => {
  try {
    const params = { Bucket: bucketName, Key: key };
    const { Body } = await s3Client.send(new GetObjectCommand(params));

    const fileStream = fs.createWriteStream(downloadPath);
    Body.pipe(fileStream);

    return `File downloaded successfully to ${downloadPath}`;
  } catch (err) {
    throw new Error(`Error downloading file: ${err.message}`);
  }
};

const deleteObject = async (bucketName, key) => {
  try {
    const params = { Bucket: bucketName, Key: key };
    await s3Client.send(new DeleteObjectCommand(params));

    return `File ${key} deleted successfully from ${bucketName}`;
  } catch (err) {
    throw new Error(`Error deleting file: ${err.message}`);
  }
};


export { getObjectList, uploadObject, downloadObject, deleteObject };
