import { TransactionManagerPort } from "../../../core/ports/TransactionManagerPort";

export class MySQLTransactionManager extends TransactionManagerPort {
  constructor(mysqlPool) {
    super();
    this.mysqlPool = mysqlPool;
  }

  async runInTransaction(operation) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      // Execute the operation within the transaction
      const result = await operation(conn);

      await conn.commit();
      return result;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release(); // Release the connection back to the pool.
    }
  }
}
