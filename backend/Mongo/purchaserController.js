const { createDBConnection, closeConnection } = require("./mongoConnector");
const Purchaser = require("../Schema/purchaserSchema");
const InventoryController = require("./inventoryController");
const {
  getTransactionsBetweenDates,
  getTransaction,
  modifyTransactionGroupByDate,
  getPurchasers,
} = require("../Utilities/utility");

/* IMPORTANT
    RDBMS       VS      MONGO
    Database            Database
    Table               Collections
    Rows                Documents
    Columns             Fields

*/
const controller = async (type, data) => {
  //Creating MONGO Connection
  await createDBConnection();

  //All Operation in Mongo
  switch (type) {
    case "Get": {
      // Find Request
      const purchaseDetails = await Purchaser.find();
      return purchaseDetails;
    }
    case "Add": {
      //Adding data
      const newPurchaser = new Purchaser({
        name: data.name,
        companyName: data.companyName,
        phone: data.phone,
        address: data.address,
        date: new Date().toString(),
        balance: 0,
        transactions: [],
      });
      return await newPurchaser.save();
    }
    case "Edit": {
      //Adding data
      const purchaser = await Purchaser.findById(data.id);
      purchaser.name= data.name
      purchaser.companyName= data.companyName
      purchaser.phone= data.phone
      purchaser.address= data.address
      purchaser.date= new Date().toString()
      const editedPurchaser = await purchaser.save();
      return editedPurchaser
    }
    case "FindByID": {
      console.log("IS Here", data);
      const purchasers = await Purchaser.findById(data);
      return purchasers;
    }
    case "findByCustomTransactions": {
      console.log("IS Here", data);
      const purchaser = await Purchaser.findById(data);
      const modifiedTransactions = modifyTransactionGroupByDate(purchaser)
      return modifiedTransactions;
    }
    case "AddTransaction": {
      // Updating the data
      console.log("Add Transaction to Purchaser----- ",data)
      let fetchedPurchaser = await Purchaser.findById(data.id);
      if (data.transaction.purchaserTxnType === "DEBIT") {
        fetchedPurchaser.balance -= data.transaction.grossTotal;
        fetchedPurchaser.transactions.push({
          numberofBags: data.transaction.numberofBags,
          totalweight: data.transaction.totalweight,
          rate: data.transaction.rate,
          type: data.transaction.purchaserTxnType,
          kisan: data.transaction.purchaserkisanId,
          kisanName: data.transaction.purchaserkisanName,
          transactionAmount: data.transaction.grossTotal,
          date: new Date(),
          balanceAfterThisTransaction: fetchedPurchaser.balance  
        });
      }
      console.log("PURCHASER Data to be update ------- ", fetchedPurchaser)
      const finalKisan = await fetchedPurchaser.save();
      return finalKisan.transactions[finalKisan.transactions.length-1];
    } 
    case "AddCreditTransaction": {
      // Updating the data
      console.log("Add credit transaction to Purchaser----- ",data)
      let fetchedPurchaser = await Purchaser.findById(data.id);
        fetchedPurchaser.balance += data.transaction.transactionAmount;
        fetchedPurchaser.transactions.push({
          transactionAmount: data.transaction.transactionAmount,
          date: new Date(),
          balanceAfterThisTransaction: fetchedPurchaser.balance,
          type: data.transaction.type
        });
      console.log("PURCHASER CREDIT ENTRY ------- ", fetchedPurchaser)
      const finalKisan = await fetchedPurchaser.save();
      return finalKisan;
    }
    case "todaystransactions": {
      // Delete
      const allPurchasers = await Purchaser.find();
      const transactions = getPurchasers(
        allPurchasers,
        data.dateToSearch,
        "byDate"
      );
      return transactions;
    }
    case "monthTransaction": {
      // Delete
      const allPurchasers = await Purchaser.find();
      const transactions = getPurchasers(
        allPurchasers,
        data.monthToSearch,
        "byMonth"
      );
      return transactions;
    }
    case "transactionBetweenDates": {
      // Delete
      const allPurchasers = await Purchaser.find();
      const transactions = getTransactionsBetweenDates(
        allPurchasers,
        data.startDate,
        data.endDate,
        data.type
      );
      return transactions;
    }
  }
  await closeConnection();
};
module.exports = { controller };
