const { createDBConnection, closeConnection } = require("../Mongo/mongoConnector");
const inventorySchema = require("../Schema/inventorySchema");
const Kisan = require("../Schema/kisanSchema");
const Purchaser = require("../Schema/purchaserSchema");
const dashboard = require("../Schema/dashboardSchema");
const monthToNumberMapping = {
   "01": {
      name: "January",
      number: "01",
   },
   "02": {
      name: "February",
      number: "02",
   },
   "03": {
      name: "March",
      number: "03",
   },
   "04": {
      name: "April",
      number: "04",
   },
   "05": {
      name: "May",
      number: "01",
   },
   "06": {
      name: "June",
      number: "01",
   },
   "07": {
      name: "July",
      number: "01",
   },
   "08": {
      name: "August",
      number: "01",
   },
   "09": {
      name: "September",
      number: "01",
   },
   10: {
      name: "October",
      number: "01",
   },
   11: {
      name: "November",
      number: "01",
   },
   12: {
      name: "December",
      number: "01",
   },
};
const getTransaction = (kisans, dateToSearch, type) => {
   const formattedDate = new Date(dateToSearch);
   if (kisans && kisans.length > 0) {
      const filteredTransactions = [];
      kisans.map((kisan) => {
         if (kisan.transactions && kisan.transactions.length > 0) {
            kisan.transactions.filter((transaction) => {
               if (filterTransactionsBy(transaction, formattedDate, type)) {
                  filteredTransactions.push({
                     kisanid: kisan._id,
                     name: kisan.name,
                     fatherName: kisan.fatherName,
                     phone: kisan.phone,
                     address: kisan.address,
                     balance: kisan.balance,
                     userType: "KISAN",
                     carryForwardAmount: kisan.carryForwardAmount,
                     ...transaction,
                  });
               }
            });
         }
      });
      return filteredTransactions;
   }
};
const getPurchasers = (purchasers, dateToSearch, type) => {
   const formattedDate = new Date(dateToSearch);
   if (purchasers && purchasers.length > 0) {
      const filtertxns = [];
      // Loop all Purchasers
      purchasers.map((purchaser) => {
         if (purchaser.transactions && purchaser.transactions.length > 0) {
            // Loop all transcations inside a purchaser
            purchaser.transactions.filter((transaction) => {
               if (filterTransactionsBy(transaction, formattedDate, type)) {
                  //push all the data that pass the criteria to a array and then return the array
                  filtertxns.push({
                     purchaserId: purchaser._id,
                     name: purchaser.name,
                     companyName: purchaser.companyName,
                     phone: purchaser.phone,
                     address: purchaser.address,
                     balance: purchaser.balance,
                     userType: "PURCHASER",
                     ...transaction.toObject(),
                  });
               }
            });
         }
      });
      return filtertxns;
   }
};
const getTransactionsBetweenDates = (
   kisansOrPurchasers,
   startDate,
   endDate,
   type
) => {
   const startDates = new Date(startDate);
   const endDates = new Date(endDate);

   if (kisansOrPurchasers && kisansOrPurchasers.length > 0) {
      const filteredTransactions = [];
      kisansOrPurchasers.map((kisanOrPurchaser) => {
         if (
            kisanOrPurchaser.transactions &&
            kisanOrPurchaser.transactions.length > 0
         ) {
            kisanOrPurchaser.transactions.filter((transaction) => {
               if (type === "kisan") {
                  if (
                     filterTransactionsBetweenDates(
                        transaction,
                        startDates,
                        endDates
                     )
                  ) {
                     filteredTransactions.push({
                        kisanid: kisanOrPurchaser._id,
                        name: kisanOrPurchaser.name,
                        fatherName: kisanOrPurchaser.fatherName,
                        phone: kisanOrPurchaser.phone,
                        address: kisanOrPurchaser.address,
                        balance: kisanOrPurchaser.balance,
                        carryForwardAmount: kisanOrPurchaser.carryForwardAmount,
                        ...transaction,
                     });
                  }
               } else {
                  if (
                     filterTransactionsBetweenDates(
                        transaction,
                        startDates,
                        endDates
                     )
                  ) {
                     filteredTransactions.push({
                        purchaserId: kisanOrPurchaser._id,
                        name: kisanOrPurchaser.name,
                        companyName: kisanOrPurchaser.companyName,
                        phone: kisanOrPurchaser.phone,
                        address: kisanOrPurchaser.address,
                        balance: kisanOrPurchaser.balance,
                        type: "PURCHASER",
                        ...transaction.toObject(),
                     });
                  }
               }
            });
         }
      });
      return filteredTransactions;
   }
};

const filterTransactionsBy = (transaction, date, type) => {
   if (type === "byDate") {
      return (
         new Date(transaction.date).getDate() === date.getDate() &&
         new Date(transaction.date).getMonth() === date.getMonth() &&
         new Date(transaction.date).getFullYear() === date.getFullYear()
      );
   }
   if (type === "byMonth") {
      return (
         new Date(transaction.date).getMonth() === date.getMonth() &&
         new Date(transaction.date).getFullYear() === date.getFullYear()
      );
   }
};
const filterTransactionsBetweenDates = (transaction, startDate, endDate) => {
   return (
      new Date(transaction.date) >= startDate &&
      new Date(transaction.date) < endDate
   );
};

const dateConverter = (date) => {
   const D = new Date(date);
   const formattedDate = `${D.getDate()}/${
      D.getMonth() + 1
   }/${D.getFullYear()} ${D.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
   })}`;
   return formattedDate;
};

const modifyTransactionGroupByDate = (purchaser) => {
   const groups = purchaser.transactions.reduce((groups, transaction) => {
      const D = new Date(transaction.date);
      const date = `${D.getDate()}/${D.getMonth() + 1}/${D.getFullYear()}`;
      if (!groups[date]) {
         groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
   }, {});

   const groupArrays = Object.keys(groups).map((date) => {
      return {
         date,
         transactions: groups[date],
      };
   });
   return groupArrays;
};

/* 

 ------------------------------- MASTER DASHBOARD GENERATOR --------------------------------------------


*/
const generateDashboard = async () => {
   let totalAdvancePending = 0;
   let totalPurchaserPending = 0;
   let totalItemWeight = 0; 
   let totalBagsSold = 0;

   let commissions = [];
   await createDBConnection();
   const kisans = await Kisan.find();
   kisans.map((kisan) => {
      totalAdvancePending += kisan.balance;
      kisan.transactions.map((trn) => {
         if (trn.type === "CREDIT") {
            totalItemWeight += trn.totalweight;
            totalBagsSold += trn.numberofBags;
         }
      });
   });
   const purchasers = await Purchaser.find();
   purchasers.map((purchaser) => {
      totalPurchaserPending += purchaser.balance;
   });
   const purchaserData = purchaserDataExtraction(purchasers);
   const topKisanDefaulters = topDefaulters(kisans);
   const topPurchaserDefaulters = topDefaulters(purchasers);
   
   commissions = getDayWisecommissions(kisans);
   const advanceDataGivenAndTakenConsolidated =
      getAdvancePaidAndSettledByKisan(kisans);
   const inventory = await inventorySchema.find();
   const topSoldItems = topSellingItemByWeight(inventory)
   const topBuyingPurchaser = topBuyingPurchasers(purchasers);
   const topSellingKisans = topSellerKisans(kisans);
   
   const data = 
   await closeConnection();
   
   return {
      totalAdvancePending,
      totalItemWeight,
      totalBagsSold,
      commissions,
      advanceDataGivenAndTakenConsolidated,
      purchaserData,
      topBuyingPurchaser,
      topSoldItems,
      topSellingKisans,
      totalPurchaserPending,
      topKisanDefaulters,
      topPurchaserDefaulters
   };

};

const topDefaulters = (kisansOrPurchsers) => {
   const topDefaulters = kisansOrPurchsers.map(kisanOrPurchaser => {
      return {id:kisanOrPurchaser._id,
      name: kisanOrPurchaser.name,
      balance: kisanOrPurchaser.balance
   }
   }).sort((a,b) => a.balance-b.balance).slice(0,5);
   return topDefaulters;
}

const topSellingItemByWeight = (items) => {
   const topSellingItem = items.sort((a,b)=>a.totalWeight-b.totalWeight).slice(0,5);
   return topSellingItem;
}

const topBuyingPurchasers = (purchasers) => {
   return purchasers.map(purchaser => {
      let transactionSum = 0
      if(purchaser.transactions && purchaser.transactions.length>0){
         purchaser.transactions.map(trn => {
            if(trn.type==="DEBIT"){
               transactionSum += trn.transactionAmount
            }
         })
      }
      return {
         sum: transactionSum,
         purchaser_id : purchaser._id,
         purchaser_name: `${purchaser.name} - ${purchaser.companyName}`
      }
   })
}

const topSellerKisans = (kisans) => {
   return kisans.map(kisan => {
      let transactionSum = 0
      kisan.transactions.map(trn => {
         if(trn.type==="CREDIT"){
            transactionSum += trn.grossTotal
         }
      })
      return {
         sum: transactionSum,
         kisan_id : kisan._id,
         kisan_name: kisan.name
      }
   })
}

//Get All Commission Data
const getDayWisecommissions = (kisans) => {
   const transactions = [].concat.apply(
      [],
      kisans.map((kisan) => kisan.transactions)
   );
   const todaysDate = new Date();
   const getMonthsForyear = getMonthsBetweenDates(
      `${todaysDate.getFullYear()}-01-01`,
      `${todaysDate.getFullYear()}-12-31`
   );
   const commissions = transactions.reduce((commissions, transaction) => {
      if (transaction.date > new Date(todaysDate.getFullYear(), 0, 1)) {
         if (transaction.type === "CREDIT") {
            const D = new Date(transaction.date);
            /* const date = `${D.getDate()}/${D.getMonth() + 1}/${D.getFullYear()}`; */
            const date = `${("0" + (D.getMonth() + 1)).slice(-2)}`;
            if (!commissions[date]) {
               commissions[date] = [];
               commissionsum = 0;
            }

            commissions[date].push(
               (transaction.commission / 100) * transaction.grossTotal
            );
         }
      }
      return commissions;
   }, {});
   const groupArrays = Object.keys(commissions).map((date) => {
      const deleteExistingMonth = getMonthsForyear.indexOf(date);
      getMonthsForyear.splice(deleteExistingMonth, 1);
      return {
         date: monthToNumberMapping[date].name,
         dateNumber: date,
         commissions: commissions[date].reduce(
            (partialSum, a) => partialSum + a,
            0
         ),
      };
   });
   const emptyMonths = getMonthsForyear.map((month) => {
      return {
         date: monthToNumberMapping[month].name,
         dateNumber: month,
         commissions: 0,
      };
   });
   const finalComissionsObject = [...groupArrays, ...emptyMonths].sort(
      (a, b) => parseFloat(a.dateNumber) - parseFloat(b.dateNumber)
   );
   return finalComissionsObject;
};

// DASHBOARD = calculating everything related to kisan - other than commission.
const getAdvancePaidAndSettledByKisan = (kisans) => {
   const transactions = [].concat.apply(
      [],
      kisans.map((kisan) => kisan.transactions)
   );
   const {monthToPrint, dateSixMonthback} = getDateSixMonthBack();
   const monthWiseAdvanceData = transactions.reduce(
      (groups = [], transaction) => {
         if (new Date(transaction.date) > dateSixMonthback) {
            const D = new Date(transaction.date);
            const date = `${("0" + (D.getMonth() + 1)).slice(-2)}`;
            if (!groups[date]) {
               groups[date] = {
                  advanceTaken: [],
                  advanceSettled: [],
                  cashPaidToKisan: []
               };
            }
            if (transaction.type === "CREDIT") {
               groups[date].advanceSettled.push(transaction.advanceSettlement);
               groups[date].cashPaidToKisan.push(transaction.paidToKisan)
               groups[date].advanceTaken.push(0);
            } else if (transaction.type === "ADVANCESETTLEMENT") {
               groups[date].advanceSettled.push(transaction.transactionAmount);
               groups[date].advanceTaken.push(0);
               groups[date].cashPaidToKisan.push(0)
            } else if (transaction.type === "DEBIT") {
               groups[date].advanceSettled.push(0);
               groups[date].advanceTaken.push(
                  Math.abs(transaction.transactionAmount)
                  );
               groups[date].cashPaidToKisan.push(0)
            }
            return groups;
         }
      },
      {}
   );
   const filledMonths = Object.keys(monthWiseAdvanceData).map((month) => {
      const deleteExistingMonth = monthToPrint.indexOf(month);
      monthToPrint.splice(deleteExistingMonth, 1);
      return {
         month: monthToNumberMapping[month].name,
         monthNumber: month,
         monthWiseAdvanceData: {
            advanceSettled: monthWiseAdvanceData[month].advanceSettled.reduce(
               (partialSum, a) => partialSum + a,
               0
            ),
            advanceTaken: monthWiseAdvanceData[month].advanceTaken.reduce(
               (partialSum, a) => partialSum + a,
               0
            ),
            cashPaidToKisan : monthWiseAdvanceData[month].cashPaidToKisan.reduce(
               (partialSum, a) => partialSum + a,
               0
            ),
         },
      };
   });
   const emptyMonths = monthToPrint.map((month) => {
      return {
         month: monthToNumberMapping[month].name,
         monthNumber: month,
         monthWiseAdvanceData: { advanceSettled: 0, advanceTaken: 0,cashPaidToKisan:0 },
      };
   });
   const allSixMonthsData = [...emptyMonths, ...filledMonths];
   return allSixMonthsData;
};

// DASHBOARD = calculating everything related to Purchaser 
const purchaserDataExtraction = (purchasers) => {
   const transactions = [].concat.apply(
      [],
      purchasers.map((purchaser) => purchaser.transactions)
   );
   const {monthToPrint, dateSixMonthback} = getDateSixMonthBack();
   const monthwisepurchaserData = transactions.reduce(
      (groups = [], transaction) => {
         if (new Date(transaction.date) > dateSixMonthback) {
            const D = new Date(transaction.date);
            const date = `${("0" + (D.getMonth() + 1)).slice(-2)}`;
            if (!groups[date]) {
               groups[date] = {
                  purchaserPaid :[]
               };
            }
            if (transaction.type === "CREDIT") {
               groups[date].purchaserPaid.push(transaction.transactionAmount);
            }else {
               groups[date].purchaserPaid.push(0);
            }
            return groups;
         }
      },
      {}
   );
   const filledMonths = Object.keys(monthwisepurchaserData).map((month) => {
      const deleteExistingMonth = monthToPrint.indexOf(month);
      monthToPrint.splice(deleteExistingMonth, 1);
      return {
         month: monthToNumberMapping[month].name,
         monthNumber: month,
         monthwisepurchaserData: {
            cashPaidToKisan : monthwisepurchaserData[month].purchaserPaid.reduce(
               (partialSum, a) => partialSum + a,
               0
            ),
         },
      };
   });
   const emptyMonths = monthToPrint.map((month) => {
      return {
         month: monthToNumberMapping[month].name,
         monthNumber: month,
         monthwisepurchaserData: { purchaserPaid : 0 },
      };
   });
   const allSixMonthsData = [...emptyMonths, ...filledMonths];
   return allSixMonthsData;
}


const getDateSixMonthBack = () => {
   let date = new Date();
   date.setMonth(date.getMonth() - 6);
   const dateSixMonthback = new Date(date.getFullYear(), date.getMonth(), 1);
   const dateSixMonthbackFormatted = `${dateSixMonthback.getFullYear()}-${
      dateSixMonthback.getMonth() + 1
   }-${dateSixMonthback.getDate()}`;
   const todaysDate = new Date();
   const todaysDateFormatted = `${todaysDate.getFullYear()}-${
      todaysDate.getMonth() + 1
   }-${todaysDate.getDate()}`;
   const monthToPrint = getMonthsBetweenDates(
      dateSixMonthbackFormatted,
      todaysDateFormatted
   );
   return {
      monthToPrint,
      dateSixMonthback
   }
}

const getMonthsBetweenDates = (startDate, endDate) => {
   var start = startDate.split("-");
   var end = endDate.split("-");
   var startYear = parseInt(start[0]);
   var endYear = parseInt(end[0]);
   var dates = [];

   for (var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
         var month = j + 1;
         var displayMonth = month < 10 ? "0" + month : month;
         dates.push(displayMonth.toString());
      }
   }
   return dates;
};

module.exports = {
   getTransaction,
   getTransactionsBetweenDates,
   modifyTransactionGroupByDate,
   generateDashboard,
   getPurchasers,
};
