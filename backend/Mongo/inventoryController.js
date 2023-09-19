const { getInventoryModel } = require("../Model/model");
const { createDBConnection, closeConnection } = require("./mongoConnector");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const controller = async (type, data) => {
  //Creating MONGO Connection
  await createDBConnection();

  //All Operation in Mongo
  switch (type) {
    case "Get": {
      // Find Request
      const Inventory = getInventoryModel();
      const inventory = await Inventory.find();
      return inventory;
    }
    case "Add": {
      //Adding data
      const saved = await data.save();
      return saved;
    }
    case "FindByID": {
      const Inventory = getInventoryModel();
      const inventory = await Inventory.findById(data);
      return inventory;
    }
    case "AddTransaction": {
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
        purchaserId : data.purchaserId,
        purchaserName: data.purchaserName,
        rate: data.rate,
        date: data.date,
      });
      fetchedInventory.totalWeight += data.totalweight;
      fetchedInventory.totalBags += data.numberofBags;
      const finalInventory = await fetchedInventory.save();
      return {inventoryItemId:finalInventory._id, transaction: finalInventory.transactions[finalInventory.transactions.length-1]} ;
    }
  }
  await closeConnection();
};
module.exports = { controller };
