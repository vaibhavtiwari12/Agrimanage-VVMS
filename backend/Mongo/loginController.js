const { createDBConnection, closeConnection } = require("./mongoConnector");
const login = require("../Schema/loginSchema");
const { getTodaysTransaction } = require("../Utilities/utility");

const controller = async (type, data) => {
  await createDBConnection();
  switch (type) {
    case "get": {
      // Find Request
      const logins = await login.findOne({
        userName: data.userName.toLowerCase(),
        password: data.password,
      });
      console.log(logins);
      return logins;
    }
    case "add": {
      // Find Request
      console.log("Data", data)
      const logn = new login({
        userName: data.userName.toLowerCase(),
        password: data.password,
      });
      const addedUser = logn.save();
      return addedUser;
    }
  }
  await closeConnection();
};

module.exports = { controller };
