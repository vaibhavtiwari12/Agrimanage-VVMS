const { ensureConnection } = require('./mongoConnector');
const login = require('../Schema/loginSchema');
const { getTodaysTransaction } = require('../Utilities/utility');

const controller = async (type, data) => {
  // Ensure database connection
  await ensureConnection();
  switch (type) {
    case 'get': {
      // Debug: Log incoming data and lengths
      console.log('[DEBUG] Login GET request data:', data);
      console.log('[DEBUG] userName value:', data.userName, 'length:', data.userName.length);
      console.log('[DEBUG] password value:', data.password, 'length:', data.password.length);
      // Find Request
      const logins = await login.findOne({
        userName: data.userName.toLowerCase(),
        password: data.password,
      });
      // Debug: Log DB result
      console.log('[DEBUG] Login GET DB result:', logins);
      return logins;
    }
    case 'add': {
      // Debug: Log incoming data
      console.log('[DEBUG] Login ADD request data:', data);
      // Find Request
      const logn = new login({
        userName: data.userName.toLowerCase(),
        password: data.password,
      });
      const addedUser = logn.save();
      // Debug: Log DB result
      console.log('[DEBUG] Login ADD DB result:', addedUser);
      return addedUser;
    }
  }
};

module.exports = { controller };
