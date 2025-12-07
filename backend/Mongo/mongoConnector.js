const mongoose = require('mongoose');

// Global connection state
let isConnected = false;

const createDBConnection = async () => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    console.log('[Backend] [INFO] Establishing MongoDB connection...');

    // Set up event listeners only once
    if (!isConnected) {
      mongoose.connection.on('connected', () => {
        console.log('[Backend] [INFO] MongoDB connected successfully');
        isConnected = true;
      });

      mongoose.connection.on('error', err => {
        console.error('[Backend] [ERROR] MongoDB connection error:', err);
        isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('[Backend] [WARN] MongoDB disconnected');
        isConnected = false;
      });
    }

    // Connect with robust options
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    });

    isConnected = true;
    return mongoose.connection;
  } catch (error) {
    console.error('[Backend] [ERROR] MongoDB connection failed:', error);
    isConnected = false;
    throw error;
  }
};

const ensureConnection = async () => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    await createDBConnection();
  }
  return mongoose.connection;
};

const closeConnection = async () => {
  if (isConnected) {
    isConnected = false;
    await mongoose.connection.close();
  }
};

const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    readyStateString: ['disconnected', 'connected', 'connecting', 'disconnecting'][
      mongoose.connection.readyState
    ],
  };
};

module.exports = { createDBConnection, ensureConnection, closeConnection, getConnectionStatus };
