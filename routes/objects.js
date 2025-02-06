import express from 'express';
import multer from 'multer';
import path from 'path';
import { getObjectList, uploadObject, downloadObject, deleteObject } from '../services/object_service.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const __dirname = path.dirname(new URL(import.meta.url).pathname);

router.get('/list', async (req, res) => {
  const { bucketName } = req.query;
  if (!bucketName) return res.status(400).json({ error: 'Bucket name is required' });

  try {
    const objects = await getObjectList(bucketName);
    res.json(objects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  const { bucketName } = req.body;
  if (!bucketName || !req.file) {
    return res.status(400).json({ error: 'Bucket name and file are required' });
  }

  try {
    const message = await uploadObject(req.file.path, bucketName, req.file.originalname);
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/download', async (req, res) => {
  const { bucketName, key } = req.query;
  if (!bucketName || !key) return res.status(400).json({ error: 'Bucket name and key are required' });

  try {
    const message = await downloadObject(bucketName, key);

    res.status(200).json({ message: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/delete', async (req, res) => {
  const { bucketName, key } = req.body;
  if (!bucketName || !key) return res.status(400).json({ error: 'Bucket name and key are required' });

  try {
    const message = await deleteObject(bucketName, key);
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 
