import { logger } from "../../utils/logger";
import { MongoClient } from "mongodb";

class MongoConnect {
  constructor() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MongoDB URI is not defined");
    }

    const maxPoolSize = parseInt(process.env.MONGO_POOL_SIZE) || 100;
    const connectTimeoutMS =
      parseInt(process.env.MONGO_CONNECT_TIMEOUT_MS) || 30000;

    this.client = new MongoClient(uri, {
      maxPoolSize,
      connectTimeoutMS,
    });
    this.isConnected = false;
    this.retryDelay = 5000;
  }

  async connectClient(retries = 3) {
    try {
      if (this.isConnected) {
        logger.info("Already connected to MongoDB");
        return;
      }

      await this.client.connect();
      this.isConnected = true;
      logger.info("Connected to MongoDb");
    } catch (e) {
      logger.error(`MongoDB connection error: ${e.message}`);

      if (retries > 0) {
        logger.info(
          `Retrying connection in ${this.retryDelay}ms. Attempts remaining: ${retries}`
        );
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.connectClient(retries - 1);
      } else {
        logger.error(
          "Max retries attempts reached. Failed to connect to MongoDB"
        );
        throw error;
      }
    }
  }

  async disconnect() {
    try {
      if (this.isConnected) {
        await this.client.close();
        this.isConnected = false;
        logger.info("MongoDB connection close");
      }
    } catch (e) {
      logger.error("Error closing connection", e);
      throw e;
    }
  }

  getClient() {
    if (!this.isConnected) {
      throw new Error("MongoDB client is not connected");
    }
    return this.client;
  }
}

export const connect = new MongoConnect();
