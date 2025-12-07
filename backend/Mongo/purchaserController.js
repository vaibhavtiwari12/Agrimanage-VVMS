const { ensureConnection } = require('./mongoConnector');
const InventoryController = require('./inventoryController');
const {
  getTransactionsBetweenDates,
  getTransaction,
  modifyTransactionGroupByDate,
  getPurchasers,
} = require('../Utilities/utility');
const { getPurchaserModel } = require('../Model/model');

/* IMPORTANT
    RDBMS       VS      MONGO
    Database            Database
    Table               Collections
    Rows                Documents
    Columns             Fields

*/
const controller = async (type, data) => {
  //Ensure MONGO Connection
  await ensureConnection();

  //All Operation in Mongo
  switch (type) {
    case 'Get': {
      // Find Request
      const Purchaser = getPurchaserModel();
      const purchaseDetails = await Purchaser.find();
      return purchaseDetails;
    }
    case 'Add': {
      //Adding data
      const Purchaser = getPurchaserModel();
      const newPurchaser = new Purchaser({
        name: data.name,
        companyName: data.companyName,
        phone: data.phone,
        address: data.address,
        date: new Date().toString(),
        balance: 0,
        purchaserCommodity: data.purchaserCommodity,
        transactions: [],
      });
      return await newPurchaser.save();
    }
    case 'Edit': {
      //Adding data
      const Purchaser = getPurchaserModel();
      const purchaser = await Purchaser.findById(data.id);
      purchaser.name = data.name;
      purchaser.companyName = data.companyName;
      purchaser.phone = data.phone;
      purchaser.address = data.address;
      purchaser.purchaserCommodity = data.purchaserCommodity;
      purchaser.date = new Date().toString();
      const editedPurchaser = await purchaser.save();
      return editedPurchaser;
    }
    case 'DeleteTransaction': {
      //Deleting data
      const Purchaser = getPurchaserModel();
      const purchaser = await Purchaser.findById(data.purchaserId);
      if (purchaser) {
        if (
          purchaser.transactions[purchaser.transactions.length - 1]._id.toString() ===
          data.purchaserTxnId.toString()
        ) {
          purchaser.balance -=
            purchaser.transactions[purchaser.transactions.length - 1].transactionAmount;
          purchaser.transactions.pop();
        }
      }
      await purchaser.save();
      return { message: 'Purchaser Credit/Payment Transaction Deleted Successfully' };
    }
    case 'FindByID': {
      const Purchaser = getPurchaserModel();
      const purchasers = await Purchaser.findById(data);
      return purchasers;
    }
    case 'getPurchaserByCommodity': {
      const Purchaser = getPurchaserModel();
      const purchasers = await Purchaser.find({ purchaserCommodity: data.purchaserCommodity });
      return purchasers;
    }
    case 'findByCustomTransactions': {
      const Purchaser = getPurchaserModel();
      const purchaser = await Purchaser.findById(data);
      const modifiedTransactions = modifyTransactionGroupByDate(purchaser);
      return modifiedTransactions;
    }
    case 'AddTransaction': {
      // Updating the data
      console.log('Add Transaction to Purchaser----- ', data);
      const Purchaser = getPurchaserModel();
      let fetchedPurchaser = await Purchaser.findById(data.id);
      if (data.transaction.purchaserTxnType === 'DEBIT') {
        fetchedPurchaser.balance -= data.transaction.grossTotal;
        fetchedPurchaser.transactions.push({
          numberofBags: data.transaction.numberofBags,
          totalweight: data.transaction.totalweight,
          rate: data.transaction.rate,
          type: data.transaction.purchaserTxnType,
          kisan: data.transaction.purchaserkisanId,
          kisanName: data.transaction.purchaserkisanName,
          transactionAmount: data.transaction.grossTotal,
          date: data.transaction.date,
          creationDate: data.transaction.creationDate,
          balanceAfterThisTransaction: fetchedPurchaser.balance,
        });
      }
      console.log('PURCHASER Data to be update ------- ', fetchedPurchaser);
      const finalKisan = await fetchedPurchaser.save();
      return finalKisan.transactions[finalKisan.transactions.length - 1];
    }
    case 'AddCreditTransaction': {
      // Updating the data
      console.log('Add credit transaction to Purchaser----- ', data);
      const Purchaser = getPurchaserModel();
      let fetchedPurchaser = await Purchaser.findById(data.id);
      fetchedPurchaser.balance += data.transaction.transactionAmount;
      const transactionToPush = {
        transactionAmount: data.transaction.transactionAmount,
        comment: data.transaction.comment,
        date: new Date(),
        balanceAfterThisTransaction: fetchedPurchaser.balance,
        type: data.transaction.type,
      };
      fetchedPurchaser.transactions.push(transactionToPush);
      const finalKisan = await fetchedPurchaser.save();
      return finalKisan;
    }
    case 'todaystransactions': {
      // Delete
      const Purchaser = getPurchaserModel();
      const allPurchasers = await Purchaser.find();
      const transactions = getPurchasers(allPurchasers, data.dateToSearch, 'byDate');
      return transactions;
    }
    case 'monthTransaction': {
      // Delete
      const Purchaser = getPurchaserModel();
      const allPurchasers = await Purchaser.find();
      const transactions = getPurchasers(allPurchasers, data.monthToSearch, 'byMonth');
      return transactions;
    }
    case 'transactionBetweenDates': {
      // Delete
      const Purchaser = getPurchaserModel();
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
};
module.exports = { controller };
