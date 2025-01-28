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

      if (guestExist === null) {
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
}
