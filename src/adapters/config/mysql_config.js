import { mysql } from "mysql2/promise";
import { logger } from "../../utils/logger.js";
import { error } from "winston";

class MySQLConnect {
  constructor() {
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE;

    if (!host || !user || !password || !database) {
      throw new Error("Missing require MySQL configuration.");
    }

    this.config = {
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.MYSQL_POOL_SIZE) || 10,
      queueLimit: parseInt(process.env.MYSQL_QUEUE_LIMIT) || 0,
      connectTimeout: parseInt(process.env.MYSQL_CONNECT_TIMEOUT_MS) || 10000,
    };
    this.pool = null;
    this.isConnected = false;
    this.retryDelay = 5000;
    this.maxRetries = parseInt(process.env.MYSQL_MAX_RETRIES) || 3;
  }

  async connectPool(retries = this.maxRetries) {
    if (this.isConnected && this.pool) return;

    try {
      this.pool = mysql.createPool(this.config);

      // Verify the connection
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();

      this.isConnected = true;
      logger.info("MySQL pool created successfully");

      this.pool.on("error", async err => {
        logger.error("Unexpected error on idle Mysql client", err);
        if (["PROTOCOL_CONNECTION_LOST", "ECONNREFUSED"].includes(err.code)) {
          logger.info("Attempting to reconnect MySQL pool...");
          this.isConnected = false;
          this.pool = null;
          await this.connectPool();
        }
      });
    } catch (e) {
      logger.error(`MySQL connection error: ${e.message}`);

      if (retries > 0) {
        logger.info(
          `Retrying connection in ${this.retryDelay}ms. Attempts remaining: ${retries}`
        );
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.connectPool(retries - 1);
      } else {
        logger.error("Max retry attempts reached. Failed to connect to MySQL");
        throw error;
      }
    }
  }

  async disconnect() {
    if (!this.pool) {
      logger.info("MySQL is already disconnected");
      return;
    }

    try {
      await this.pool.end();
      this.isConnected = false;
      this.pool = null;
      logger.info("MySQL pool disconnected successfully");
    } catch (e) {
      logger.error(`Error disconnecting MySQL pool: ${e.message}`);
      throw e;
    }
  }

  getPool() {
    if (!this.isConnected || !this.pool) {
      throw new Error("MySQL pool is not initialized");
    }

    return this.pool;
  }
}

export const mysqlPool = new MySQLConnect();
