
const { MongoClient } = require("mongodb");
const uri = ""//Connnetion String;
const options = { useUnifiedTopology: true };
const updateKisanWithCommodity = async (req) => {
    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db("VVMS");
    
        await db
      .collection("kisans")
      .updateMany({},{
        $set: {
            kisanCommodity : "मटर "
        }
      });
      await client.close()


    console.log("Script Ran Successfully",)

};
const updatePurchaserWithCommodity = async (req) => {
    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db("VVMS");
    
        await db
      .collection("purchasers")
      .updateMany({},{
        $set: {
            purchaserCommodity : "मटर "
        }
      });
      await client.close()


    console.log("Script Ran Successfully",)

};
updateKisanWithCommodity();
updatePurchaserWithCommodity();