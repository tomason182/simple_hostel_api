import { Guest } from "./entities/Guest";

export class GuestService {
  constructor(guestOutputPort) {
    this.guestOutputPort = guestOutputPort;
  }

  async createGuest(propertyId, userId, guestData, conn) {
    try {
      const guest = new Guest(guestData);
      // Find if guest exists
      const guestExist = await this.guestOutputPort.findGuestByEmail();
    } catch (e) {
      throw e;
    }
  }
}
