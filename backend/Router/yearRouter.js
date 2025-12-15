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

// Add a new year (with automatic collection creation)
router.post('/', async (req, res) => {
  try {
    await ensureConnection();
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Year value required' });

    // Import the year service
    const { createNewYearWithCollections } = require('../Services/yearService');

    // Create year and all associated collections
    const result = await createNewYearWithCollections(value);

    res.status(201).json({
      success: true,
      message: `Year ${value} created successfully`,
      year: result.year,
      collections: result.collections,
      stats: result.stats,
    });
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      res.status(400).json({ error: 'Year already exists' });
    } else if (err.message && err.message.includes('Invalid year format')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('[Backend] [ERROR] Year creation failed:', err);
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
