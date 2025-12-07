const { ensureConnection } = require('../Mongo/mongoConnector');
const mongoose = require('mongoose');

module.exports = {
  isAuthenticated: async (req, res, next) => {
    if (req && req.session && req.session.user && (await isValidSession(req))) {
      next();
    } else {
      res.status(401).send({ success: false, error: 'user is unauthorized' });
    }
  },
  login: async (req, res, next) => {
    next();
  },
};

const isValidSession = async req => {
  try {
    await ensureConnection();
    const db = mongoose.connection.db;
    let document = {};
    document = await db
      .collection('mySessions')
      .findOne({ _id: req.session.id, 'session.user': req.session.user });
    return document;
  } catch (error) {
    console.error('[Backend] [ERROR] Session validation failed:', error);
    return null;
  }
};
