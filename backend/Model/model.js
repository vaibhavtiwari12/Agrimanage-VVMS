const mongoose = require('mongoose');
const KisanSchema = require("../Schema/kisanSchema");
const purchaserSchema = require("../Schema/purchaserSchema")
const InventorySchema = require("../Schema/inventorySchema")


const getKisanModel = ()=> {
      console.log("Connecting to the Kisan Table -", process.env.KISANTABLE)
      const Kisan = mongoose.model("Kisan", KisanSchema,process.env.KISANTABLE);
      return Kisan

}

const getInventoryModel = () => {
    console.log("Connecting to the Inventory Table -", process.env.INVENTORYTABLE)
    const Inventory = mongoose.model("Inventory", InventorySchema, process.env.INVENTORYTABLE);
    return Inventory;
}

const getPurchaserModel = () => {
    console.log("Connecting to the Inventory Table -", process.env.PURCHASERTABLE)
    const Purchaser = mongoose.model("Purchaser", purchaserSchema,process.env.PURCHASERTABLE);
    return Purchaser;
}

module.exports = {
    getKisanModel,
    getInventoryModel,
    getPurchaserModel
}