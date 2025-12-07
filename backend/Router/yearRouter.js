const express = require('express');
const router = express.Router();
const Year = require('../Model/yearModel');
const { ensureConnection } = require('../Mongo/mongoConnector');

// Get all years
router.get('/', async (req, res) => {
  try {
    await ensureConnection();
    const years = await Year.find().sort({ value: -1 });
    const yearValues = years.map(y => y.value);
    res.json(yearValues);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch years', details: err.message });
  }
});

// Add a new year (optional, for admin use)
router.post('/', async (req, res) => {
  try {
    await ensureConnection();
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Year value required' });

    const year = new Year({ value });
    await year.save();
    res.status(201).json({ success: true, year: year.value });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Year already exists' });
    } else {
      res.status(500).json({ error: 'Failed to add year', details: err.message });
    }
  }
});

// Debug endpoint to check database connection and years
router.get('/debug', async (req, res) => {
  try {
    await ensureConnection();
    const count = await Year.countDocuments();
    const years = await Year.find();

    res.json({
      success: true,
      totalCount: count,
      years: years,
      message: 'Database connection working',
      collectionName: Year.collection.name,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Database connection failed',
      details: err.message,
    });
  }
});

module.exports = router;
