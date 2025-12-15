const mongoose = require('mongoose');
const Year = require('../Model/yearModel');
const { ensureConnection } = require('../Mongo/mongoConnector');

/**
 * Creates a new year and automatically sets up all required collections
 * - Copies kisans with reset balances and no transactions
 * - Copies purchasers with reset balances and no transactions
 * - Copies inventory with reset totalWeight and totalBags
 */
async function createNewYearWithCollections(yearString) {
  try {
    await ensureConnection();

    // Validate year format (e.g., "2025-26")
    const match = yearString.match(/^(\d{4})-(\d{2})$/);
    if (!match) {
      throw new Error('Invalid year format. Expected format: YYYY-YY (e.g., 2025-26)');
    }

    const startYear = match[1];
    const collectionYear = startYear;

    // Check if year already exists
    const existingYear = await Year.findOne({ value: yearString });
    if (existingYear) {
      throw new Error(`Year ${yearString} already exists`);
    }

    // Create the year entry
    const newYear = new Year({ value: yearString });
    await newYear.save();
    console.log(`[Backend] [INFO] Year ${yearString} created in database`);

    // Determine source collections (previous year)
    const previousYear = String(Number(collectionYear) - 1);
    const sourceKisansCollection = `kisans${previousYear}`;
    const sourcePurchasersCollection = `purchasers${previousYear}`;
    const sourceInventoryCollection = `inventory${previousYear}`;

    // Target collections for new year
    const targetKisansCollection = `kisans${collectionYear}`;
    const targetPurchasersCollection = `purchasers${collectionYear}`;
    const targetInventoryCollection = `inventory${collectionYear}`;

    const db = mongoose.connection.db;

    // Check if source collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    let kisansCopied = 0;
    let purchasersCopied = 0;
    let inventoriesCopied = 0;

    // Copy Kisans (without transactions, reset balances)
    if (collectionNames.includes(sourceKisansCollection)) {
      const kisans = await db.collection(sourceKisansCollection).find({}).toArray();

      if (kisans.length > 0) {
        const kisansWithoutTransactions = kisans.map(kisan => {
          delete kisan._id; // Remove _id to create new documents
          delete kisan.transactions;
          kisan.balance = 0;
          kisan.carryForwardAmount = 0;
          return kisan;
        });

        await db.collection(targetKisansCollection).insertMany(kisansWithoutTransactions);
        kisansCopied = kisansWithoutTransactions.length;
        console.log(`[Backend] [INFO] Copied ${kisansCopied} kisans to ${targetKisansCollection}`);
      }
    } else {
      console.log(
        `[Backend] [WARN] Source collection ${sourceKisansCollection} not found. Creating empty collection.`
      );
    }

    // Copy Purchasers (without transactions, reset balances)
    if (collectionNames.includes(sourcePurchasersCollection)) {
      const purchasers = await db.collection(sourcePurchasersCollection).find({}).toArray();

      if (purchasers.length > 0) {
        const purchasersWithoutTransactions = purchasers.map(purchaser => {
          delete purchaser._id; // Remove _id to create new documents
          delete purchaser.transactions;
          purchaser.balance = 0;
          return purchaser;
        });

        await db.collection(targetPurchasersCollection).insertMany(purchasersWithoutTransactions);
        purchasersCopied = purchasersWithoutTransactions.length;
        console.log(
          `[Backend] [INFO] Copied ${purchasersCopied} purchasers to ${targetPurchasersCollection}`
        );
      }
    } else {
      console.log(
        `[Backend] [WARN] Source collection ${sourcePurchasersCollection} not found. Creating empty collection.`
      );
    }

    // Copy Inventory (reset totalWeight and totalBags)
    if (collectionNames.includes(sourceInventoryCollection)) {
      const inventories = await db.collection(sourceInventoryCollection).find({}).toArray();

      if (inventories.length > 0) {
        const inventoriesReset = inventories.map(inventory => {
          delete inventory._id; // Remove _id to create new documents
          inventory.totalWeight = 0;
          inventory.totalBags = 0;
          return inventory;
        });

        await db.collection(targetInventoryCollection).insertMany(inventoriesReset);
        inventoriesCopied = inventoriesReset.length;
        console.log(
          `[Backend] [INFO] Copied ${inventoriesCopied} inventories to ${targetInventoryCollection}`
        );
      }
    } else {
      console.log(
        `[Backend] [WARN] Source collection ${sourceInventoryCollection} not found. Creating empty collection.`
      );
    }

    return {
      success: true,
      year: yearString,
      collections: {
        kisans: targetKisansCollection,
        purchasers: targetPurchasersCollection,
        inventory: targetInventoryCollection,
      },
      stats: {
        kisansCopied,
        purchasersCopied,
        inventoriesCopied,
      },
    };
  } catch (error) {
    console.error(`[Backend] [ERROR] Failed to create year ${yearString}:`, error);
    throw error;
  }
}

module.exports = { createNewYearWithCollections };
