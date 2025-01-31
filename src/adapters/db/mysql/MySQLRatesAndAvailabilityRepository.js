export class MySQLRatesAndAvailabilityRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async create(rateAndAvailability, conn = null) {
    try {
      return "Rate and availability created";
    } catch (e) {
      throw new Error(
        `An error occurred trying to create rate and availability range. Error: ${e.message}`
      );
    }
  }
}
