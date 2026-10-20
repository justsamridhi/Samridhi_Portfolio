import express from 'express';
import Guestbook from '../models/Guestbook.js';

const router = express.Router();

// Middleware to check admin secret
const adminAuth = (req, res, next) => {
  const secret = req.header('x-admin-secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET public approved entries
router.get('/', async (req, res, next) => {
  try {
    const approved = await Guestbook.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(16);
    res.json(approved);
  } catch (err) {
    next(err);
  }
});

// POST new submission (pending)
router.post('/', async (req, res, next) => {
  try {
    const { gridData } = req.body;
    if (!Array.isArray(gridData) || gridData.length !== 256) {
      return res.status(400).json({ error: 'Invalid grid data' });
    }
    const entry = new Guestbook({
      gridData,
      date: new Date().toLocaleDateString(),
      status: 'pending',
    });
    await entry.save();
    res.status(201).json({ success: true, id: entry._id });
  } catch (err) {
    next(err);
  }
});

// Admin: list pending submissions
router.get('/pending', adminAuth, async (req, res, next) => {
  try {
    const pending = await Guestbook.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    next(err);
  }
});

// Admin: approve submission
router.patch('/:id/approve', adminAuth, async (req, res, next) => {
  try {
    const entry = await Guestbook.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    entry.status = 'approved';
    await entry.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Admin: reject (delete) submission
router.delete('/:id', adminAuth, async (req, res, next) => {
  try {
    await Guestbook.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
