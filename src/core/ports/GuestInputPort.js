export class GuestInputPort {
  constructor(guestService) {
    this.guestService = guestService;
  }

  createGuest(propertyId, guestData) {
    return this.guestService.createGuest(propertyId, guestData);
  }

  updateGuest(guestData, propertyId) {
    return this.guestService.updateGuest(guestData, propertyId);
  }
}
