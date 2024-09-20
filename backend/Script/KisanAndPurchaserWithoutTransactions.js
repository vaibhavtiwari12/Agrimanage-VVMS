
const { MongoClient } = require("mongodb");
const uri = ""//Connnetion String;
const options = { useUnifiedTopology: true };
const duplicateKisanDataWithoutTransactions = async (req) => {
    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db("VVMS");
    let kisans = [];
    kisans = await db
      .collection("kisans2023")
      .find({}).toArray();
      

    const kisansWithoutTransactions = kisans.map(kisan => {
        delete kisan.transactions;
        kisan.balance = 0;
        kisan.carryForwardAmount = 0;
        return kisan;
    })
    
    
        await db
      .collection("kisans2024")
      .insertMany(kisansWithoutTransactions);
      await client.close()


    console.log("Kisan Without Transactions ",  kisansWithoutTransactions)

};

const duplicatePurchaserDataWithoutTransactions =async  () => {
    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db("VVMS");
    let purchasers = [];
    purchasers = await db
      .collection("purchasers2023")
      .find({}).toArray();
      

    const purchaserssWithoutTransactions = purchasers.map(purchaser => {
        delete purchaser.transactions;
        purchaser.balance = 0;
        return purchaser;
    })
    
    
        await db
      .collection("purchasers2024")
      .insertMany(purchaserssWithoutTransactions);
      await client.close()


    console.log("Purcahsers Without Transactions ",  purchaserssWithoutTransactions)
}

duplicateKisanDataWithoutTransactions();
duplicatePurchaserDataWithoutTransactions()
