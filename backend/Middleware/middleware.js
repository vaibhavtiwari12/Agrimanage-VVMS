const { MongoClient } = require("mongodb");

module.exports = {
  isAuthenticated: async (req, res, next) => {
    if (req && req.session && req.session.user && (await isValidSession(req))) {
      next();
    } else {
      res.status(401).send({ success: false, error: "user is unauthorized" });
    } 
  },
  login: async (req, res, next) => {
    next();
  },
};

const isValidSession = async (req) => {
  const uri = `${process.env.MONGO_URL}`;
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options);
  await client.connect();
  const db = client.db("VVMS");
  let document = {};
  document = await db
    .collection("mySessions")
    .findOne({ _id: req.session.id, "session.user": req.session.user });
    await client.close()
  return document;
};
