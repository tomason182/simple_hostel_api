export class GuestInputPort {
  constructor(guestService) {
    this.guestService = guestService;
  }

  createGuest(propertyId, userId, guestData) {
    return this.guestService.createGuest(propertyId, userId, guestData);
  }
}
