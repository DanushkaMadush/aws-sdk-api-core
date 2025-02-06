import { S3Client, CreateBucketCommand, DeleteBucketCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
});

// List all S3 buckets
const listBuckets = async () => {
    try {
      const data = await s3Client.send(new ListBucketsCommand({}));
      return data.Buckets;
    } catch (err) {
      throw new Error(`Error listing buckets: ${err.message}`);
    }
  };
  
  // Create a new S3 bucket
  const createBucket = async (bucketName) => {
    try {
      const params = { Bucket: bucketName };
      await s3Client.send(new CreateBucketCommand(params));
      return `Bucket "${bucketName}" created successfully`;
    } catch (err) {
      throw new Error(`Error creating bucket: ${err.message}`);
    }
  };
  
  // Delete an S3 bucket
  const deleteBucket = async (bucketName) => {
    try {
      const params = { Bucket: bucketName };
      await s3Client.send(new DeleteBucketCommand(params));
      return `Bucket "${bucketName}" deleted successfully`;
    } catch (err) {
      throw new Error(`Error deleting bucket: ${err.message}`);
    }
  };
  
export { listBuckets, createBucket, deleteBucket };