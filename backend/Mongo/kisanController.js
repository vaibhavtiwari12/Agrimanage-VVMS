const { createDBConnection, closeConnection } = require("./mongoConnector");
const Kisan = require("../Schema/kisanSchema");
const InventoryController = require("../Mongo/inventoryController");
const Inventory = require("../Schema/inventorySchema");
const {
  getTransactionsBetweenDates,
  getTransaction,
} = require("../Utilities/utility");
const Purchaser = require("../Schema/purchaserSchema");

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
      const posts = await Kisan.find();
      return posts;
    }
    case "Add": {
      //Adding data
      const saved = await data.save();
      return saved
    }
    case "Edit": {
      //Editing data
      const kisan = await Kisan.findById(data.id);
      console.log("Kisan Found ", kisan)
      kisan.name = data.name;
      kisan.fatherName = data.fatherName;
      kisan.phone = data.phone;
      kisan.address = data.address;
      kisan.date= new Date();
      const saved = await kisan.save();
      return saved
    }
    case "FindByID": {
      console.log("IS Here", data);
      const kisan = await Kisan.findById(data);
      return kisan;
    }
    case "AddTransaction": {
      // Updating the data
      let updatekisan = await Kisan.findById(data.id);
      
      if (
        data.transaction.type === "DEBIT" ||
        data.transaction.type === "ADVANCESETTLEMENT"
      ) {
        updatekisan.balance += data.transaction.transactionAmount;
      } else {
        if(data.transaction.purchaserId && data.transaction.itemType!==""){
          const transactionAdded = await InventoryController.controller("AddTransaction", {
            itemName: data.transaction.itemType,
            kisanName: updatekisan.name,
            kisanId: updatekisan._id,
            numberofBags: data.transaction.numberofBags,
            totalweight: data.transaction.totalweight,
            rate: data.transaction.rate,
            purchaserId : data.transaction.purchaserId,
            purchaserName: data.transaction.purchaserName,
            purchaserTxnId: data.transaction.purchaserTxnId
          });
          data.transaction["inventoryTxnId"] = transactionAdded.transaction._id.toString();
          data.transaction["inventoryItemId"] = transactionAdded.inventoryItemId.toString();
        }

        updatekisan.balance += parseInt(data.transaction.advanceSettlement);
        updatekisan.carryForwardAmount =
          data.transaction.carryForwardFromThisEntry;
      }
      updatekisan.transactions.push(data.transaction);
      const finalKisan = await updatekisan.save();
      return finalKisan;
    }
    case "deleteTransaction" : {
      console.log("Data Received in Delete ", data)
      let deleteKisanTxn = await Kisan.findById(data.id);
      let deleteInventoryTxn = await Inventory.findById(data.inventoryItemId);
      let deletePurchaserTxn = await Purchaser.findById(data.purchaseId);
      //console.log("PURCHASES", deletePurchaserTxn);
      //Delete PurchaserRecord
      const updatedTransactionsForPurchase = []; 
      let purTxnIndexToDelete = null;
      let deletedtransactionAmount = 0;
      if(deletePurchaserTxn) {
        deletePurchaserTxn.transactions.map((txn,index) => {
          if(txn._id == data.purchaserTxnId){
            console.log("Is Coming here?")
            purTxnIndexToDelete = index
            deletedtransactionAmount = txn.transactionAmount;
            deletePurchaserTxn.balance += txn.transactionAmount;
          }else {
            // update the balance of all the transactions after the deleted 
            // transaction with the transaction amount of the deleted transaction.
            if(purTxnIndexToDelete!==null && index>purTxnIndexToDelete){
                console.log("updating Index ================= ", index)
                console.log("Value of the Delete Transaction ========", deletedtransactionAmount);
                console.log("Updated Value BEFORE the transaction ====== ", txn.balanceAfterThisTransaction)
                txn.balanceAfterThisTransaction +=  deletedtransactionAmount;
                console.log("Updated Value AFTER the transaction ====== ", txn.balanceAfterThisTransaction)
            }
            updatedTransactionsForPurchase.push(txn);
          }
        })
        deletePurchaserTxn.transactions = updatedTransactionsForPurchase;
        console.log("delete PurchaserTxn",updatedTransactionsForPurchase)
        await deletePurchaserTxn.save();
      }

      //Delete Inventory Transaction
      const updatedInventoryTransactions = []
      if(deleteInventoryTxn) {
        deleteInventoryTxn.transactions.map(txn => {
          if(txn._id != data.inventoryTxnId) {
            updatedInventoryTransactions.push(txn)
          }
        })
        deleteInventoryTxn.transactions = updatedInventoryTransactions;
        await deleteInventoryTxn.save();
      }

      //deleteKisanTransaction
      const updatedKisanTransaction = [];
      deleteKisanTxn.transactions.map(txn => {
        if(txn._id == data.kisanTxnId){
          deleteKisanTxn.balance -= txn.advanceSettlement; 
          const carryOfPrevTransaction = txn.carryForwardFromThisEntry + txn.paidToKisan + txn.advanceSettlement - txn.netTotal;
          deleteKisanTxn.carryForwardAmount = carryOfPrevTransaction;
        }else {
          updatedKisanTransaction.push(txn);
        }
        deleteKisanTxn.transactions = updatedKisanTransaction;
      })
      await deleteKisanTxn.save();
      return "Updated Successfully";
    }

    case "deleteDebitTransaction" : {
      let deleteKisanTxn = await Kisan.findById(data.kisanId);
      if(deleteKisanTxn) {
       if(deleteKisanTxn.transactions[deleteKisanTxn.transactions.length-1]._id.toString() === data.transactionID.toString()) {
         deleteKisanTxn.balance -= deleteKisanTxn.transactions[deleteKisanTxn.transactions.length-1].transactionAmount;
         deleteKisanTxn.transactions.pop();
       }
      }
      await deleteKisanTxn.save();
      return "Kisan Debit Transaction Deleted Successfully"
    }
    case "DeleteAdvanceSettlementTransaction" : {
      let deleteKisanTxn = await Kisan.findById(data.kisanId);
      if(deleteKisanTxn) {
       if(deleteKisanTxn.transactions[deleteKisanTxn.transactions.length-1]._id.toString() === data.transactionID.toString()) {
         deleteKisanTxn.balance -= deleteKisanTxn.transactions[deleteKisanTxn.transactions.length-1].transactionAmount;
         deleteKisanTxn.transactions.pop();
       }
      }
      await deleteKisanTxn.save();
      return "Kisan AdvanceSettlement Transaction Deleted Successfully"
    }
    case "editTransaction": {
      // Delete
      const kisanToUpdate = await Kisan.findById(data.id);
      const newKisanTransaction = kisanToUpdate.transactions.map((trans) => {
        if (trans._id == data.transactionNumber) {
          return { ...trans, comment: data.comment };
        } else return trans;
      });
      console.log("newKisanTransaction", newKisanTransaction);
      kisanToUpdate.transactions = newKisanTransaction;
      console.log("kisanToUpdate", kisanToUpdate);
      const finalKisan = await kisanToUpdate.save();
      return finalKisan;
    }
    case "todaystransactions": {
      // Delete
      const allKisans = await Kisan.find();
      const transactions = getTransaction(
        allKisans,
        data.dateToSearch,
        "byDate"
      );
      return transactions;
    }
    case "monthTransaction": {
      // Delete
      const allKisans = await Kisan.find();
      const transactions = getTransaction(
        allKisans,
        data.monthToSearch,
        "byMonth"
      );
      return transactions;
    }
    case "transactionBetweenDates": {
      // Delete
      const allKisans = await Kisan.find();
      const transactions = getTransactionsBetweenDates(
        allKisans,
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
