import express from 'express';
import { listBuckets, createBucket, deleteBucket } from '../services/bucket_service.js';

const router = express.Router();

// Route to list all buckets
router.get('/list', async (req, res) => {
  try {
    const buckets = await listBuckets();
    res.json({ buckets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to create a bucket
router.post('/create', async (req, res) => {
  const { bucketName } = req.body;
  if (!bucketName) {
    return res.status(400).json({ error: 'Bucket name is required' });
  }
  try {
    const message = await createBucket(bucketName);
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a bucket
router.delete('/delete', async (req, res) => {
  const { bucketName } = req.body;
  if (!bucketName) {
    return res.status(400).json({ error: 'Bucket name is required' });
  }
  try {
    const message = await deleteBucket(bucketName);
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 
