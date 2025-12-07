const { ensureConnection } = require('../Mongo/mongoConnector');

/**
 * Wrapper function to execute database operations with automatic retry
 * This helps handle "Topology is closed" errors during multiple rapid calls
 */
const withDatabase = async (operation, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure connection before each operation
      await ensureConnection();

      // Execute the database operation
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(
        `[Backend] [WARN] Database operation failed (attempt ${attempt}/${maxRetries}):`,
        error.message
      );

      // Check if it's a connection-related error that might be retryable
      const isRetryableError =
        error.message &&
        (error.message.includes('Topology is closed') ||
          error.message.includes('MongoNetworkError') ||
          error.message.includes('connection closed') ||
          error.message.includes('server selection timed out'));

      // If it's a retryable error and we have retries left, wait and try again
      if (isRetryableError && attempt < maxRetries) {
        console.log(`[Backend] [INFO] Retrying database operation in ${attempt * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
        continue;
      }

      // If not retryable or out of retries, throw the error
      throw error;
    }
  }

  throw lastError;
};

module.exports = { withDatabase };
