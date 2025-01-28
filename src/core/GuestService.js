import { Guest } from "./entities/Guest.js";

export class GuestService {
  constructor(guestOutputPort) {
    this.guestOutputPort = guestOutputPort;
  }

  async createGuest(propertyId, guestData, conn = null) {
    try {
      const guest = new Guest(guestData);
      // Find if guest exists
      const guestExist = await this.guestOutputPort.findGuestByEmail(
        guest.getEmail(),
        propertyId,
        conn
      );

      if (guestExist !== null) {
        throw new Error(`Guest with email ${guest.getEmail()} already exist`);
      }

      const result = await this.guestOutputPort.saveGuest(
        guest,
        propertyId,
        conn
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  async updateGuest(guestData, propertyId) {
    try {
      const guest = new Guest(guestData);
      const guestExist = await this.guestOutputPort.findGuestByEmail(
        guest.getEmail(),
        propertyId
      );

      if (guestExist === null) {
        throw new Error("Guest exits");
      }

      const result = await this.guestOutputPort.updateGuest(guest);

      return result;
    } catch (e) {
      throw e;
    }
  }
}
