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
      const guestExist = await this.guestOutputPort.findGuestById(
        guest.getId(),
        propertyId
      );

      if (guestExist === null) {
        throw new Error(`We couldn't find a guest with ID ${guest.getId()}`);
      }

      const existedGuest = new Guest(guestExist);

      // Check if the provided email is the same that the stored email. If not check if the provided email exist in the db.
      if (existedGuest.getEmail() !== guest.getEmail()) {
        const newEmailExist = await this.guestOutputPort.findGuestByEmail(
          guest.getEmail(),
          propertyId
        );

        if (newEmailExist !== null) {
          throw new Error(
            `The new email provided, ${guest.getEmail()}, already exists. Please use a different email.`
          );
        }
      }

      const result = await this.guestOutputPort.updateGuest(guest);

      return result;
    } catch (e) {
      throw e;
    }
  }
}
