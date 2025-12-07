const express = require('express');
const IdentificationType = require('../Schema/identificationTypeSchema');

const router = express.Router();

// Seed default identification types
const seedDefaultTypes = async () => {
  try {
    const count = await IdentificationType.countDocuments();
    if (count === 0) {
      const defaultTypes = [
        { typeName: 'Aadhar', isDefault: true },
        { typeName: 'PAN', isDefault: true },
        { typeName: 'Voter', isDefault: true },
      ];
      await IdentificationType.insertMany(defaultTypes);
      console.log('Default identification types seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding identification types:', error);
  }
};

// Call seed function
seedDefaultTypes();

// GET all identification types
router.get('/', async (req, res) => {
  try {
    const types = await IdentificationType.find().sort({ isDefault: -1, typeName: 1 });
    res.json(types);
  } catch (error) {
    console.error('Error fetching identification types:', error);
    res.status(500).json({ error: 'Failed to fetch identification types' });
  }
});

// POST new identification type
router.post('/', async (req, res) => {
  try {
    const { typeName } = req.body;

    if (!typeName || !typeName.trim()) {
      return res.status(400).json({ error: 'Type name is required' });
    }

    // Check if type already exists
    const existing = await IdentificationType.findOne({
      typeName: { $regex: new RegExp(`^${typeName.trim()}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({ error: 'This identification type already exists' });
    }

    const newType = new IdentificationType({
      typeName: typeName.trim(),
      isDefault: false,
    });

    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    console.error('Error creating identification type:', error);
    res.status(500).json({ error: 'Failed to create identification type' });
  }
});

module.exports = router;
