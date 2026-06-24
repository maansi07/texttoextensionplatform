import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Extension from '../models/Extension.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, templateType, code, generatedBy, aiPrompt } = req.body;

    const extension = new Extension({
      userId: req.user.id,
      name,
      description,
      templateType,
      code,
      generatedBy,
      aiPrompt,
    });

    await extension.save();

    res.status(201).json({
      success: true,
      extension,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const extensions = await Extension.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: extensions.length,
      extensions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const extension = await Extension.findById(req.params.id).populate('userId', 'name');

    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    if (!extension.isPublic && extension.userId._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      extension,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    let extension = await Extension.findById(req.params.id);

    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    if (extension.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    extension = await Extension.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      extension,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const extension = await Extension.findById(req.params.id);

    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    if (extension.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Extension.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Extension deleted',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/download', protect, authorize('Pro'), async (req, res) => {
  try {
    const extension = await Extension.findById(req.params.id);

    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    extension.downloads += 1;
    await extension.save();

    res.status(200).json({
      success: true,
      message: 'Download prepared',
      extension,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;