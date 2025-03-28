import { Guest } from "./entities/Guest.js";

export class GuestService {
  constructor(guestOutputPort) {
    this.guestOutputPort = guestOutputPort;
  }

  async createGuest(propertyId, guestData, conn = null) {
    try {
      // Check If property exist
      const propertyExist = await this.guestOutputPort.findPropertyById(
        propertyId
      );

      if (propertyExist === null) {
        throw new Error(`Property with ID ${propertyId} does not exist`);
      }

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
        return {
          status: "error",
          msg: `We couldn't find a guest with ID ${guest.getId()}`,
        };
      }

      const existedGuest = new Guest(guestExist);

      // Check if the provided email is the same that the stored email. If not check if the provided email exist in the db.
      if (existedGuest.getEmail() !== guest.getEmail()) {
        const newEmailExist = await this.guestOutputPort.findGuestByEmail(
          guest.getEmail(),
          propertyId
        );

        if (newEmailExist !== null) {
          return {
            status: "error",
            msg: `The new email provided, ${guest.getEmail()}, already exists. Please use a different email.`,
          };
        }
      }

      const result = await this.guestOutputPort.updateGuest(guest);

      return {
        status: "ok",
        msg: result,
      };
    } catch (e) {
      throw e;
    }
  }

  async findGuestById(guestId, propertyId) {
    try {
      const guestExist = await this.guestOutputPort.findGuestById(
        guestId,
        propertyId
      );

      if (guestExist === null) {
        throw new Error(`Unable to find a guest with ID: ${guestId}`);
      }

      const guest = new Guest(guestExist);

      return guest;
    } catch (e) {
      throw e;
    }
  }
}
