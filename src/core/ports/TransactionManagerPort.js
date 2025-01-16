export class TransactionManagerPort {
  async runInTransaction(operation) {
    throw new Error("runInTransaction must be implemented by adapter");
  }
}
