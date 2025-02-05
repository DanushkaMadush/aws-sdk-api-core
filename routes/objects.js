const express = require('express');
const { getObjectList, uploadObject, downloadObject, deleteObject } = require('../services/object_service');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
  if (!bucketName || !req.file) return res.status(400).json({ error: 'Bucket name and file are required' });

  try {
    const message = await uploadObject(bucketName, req.file);
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/download', async (req, res) => {
  const { bucketName, key } = req.query;
  if (!bucketName || !key) return res.status(400).json({ error: 'Bucket name and key are required' });

  try {
    const fileStream = await downloadObject(bucketName, key);
    res.setHeader('Content-Disposition', `attachment; filename=${key}`);
    fileStream.pipe(res);
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

module.exports = router;
