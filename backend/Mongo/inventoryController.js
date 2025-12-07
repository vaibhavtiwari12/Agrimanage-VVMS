const { getInventoryModel } = require('../Model/model');
const { ensureConnection } = require('./mongoConnector');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const controller = async (type, data) => {
  //Ensure MONGO Connection
  await ensureConnection();

  try {
    //All Operation in Mongo
    switch (type) {
      case 'Get': {
        // Find Request
        const Inventory = getInventoryModel();
        const inventory = await Inventory.find();
        return inventory;
      }
      case 'GetPaginatedTransactions': {
        // Get paginated transactions for a specific inventory item
        const Inventory = getInventoryModel();
        const { inventoryId, page = 1, pageSize = 10 } = data;

        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
          throw new Error('Inventory item not found');
        }

        // Sort transactions by date (newest first)
        const sortedTransactions = inventory.transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

        return {
          transactions: paginatedTransactions,
          totalTransactions: sortedTransactions.length,
          currentPage: page,
          pageSize: pageSize,
          totalPages: Math.ceil(sortedTransactions.length / pageSize),
          itemName: inventory.itemName,
          totalWeight: inventory.totalWeight,
          totalBags: inventory.totalBags,
        };
      }
      case 'Add': {
        //Adding data
        const saved = await data.save();
        return saved;
      }
      case 'FindByID': {
        const Inventory = getInventoryModel();
        const inventory = await Inventory.findById(data);
        return inventory;
      }
      case 'AddTransaction': {
        // Updating the data
        const Inventory = getInventoryModel();
        let fetchedInventory = await Inventory.findOne({
          itemName: data.itemName,
        });
        fetchedInventory.transactions.push({
          kisanName: data.kisanName,
          kisanID: data.kisanId.toString(),
          numberofBags: data.numberofBags,
          totalweight: data.totalweight,
          purchaserId: data.purchaserId,
          purchaserName: data.purchaserName,
          rate: data.rate,
          date: data.date,
        });
        fetchedInventory.totalWeight += data.totalweight;
        fetchedInventory.totalBags += data.numberofBags;
        const finalInventory = await fetchedInventory.save();
        return {
          inventoryItemId: finalInventory._id,
          transaction: finalInventory.transactions[finalInventory.transactions.length - 1],
        };
      }
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  } catch (error) {
    console.error('[Backend] [ERROR] Inventory Controller:', error);
    throw error;
  }
};
module.exports = { controller };
