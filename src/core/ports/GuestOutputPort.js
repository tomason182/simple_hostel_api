export class GuestOutputPort {
  constructor(guestRepository) {
    this.guestRepository = guestRepository;
  }

  findGuestByEmail(email, propertyId, conn = null) {
    return this.guestRepository.findGuestByEmail(email, propertyId, conn);
  }

  findGuestById(id, propertyId, conn = null) {
    return this.guestRepository.findGuestById(id, propertyId, conn);
  }

  saveGuest(guest, propertyId, conn = null) {
    return this.guestRepository.saveGuest(guest, propertyId, conn);
  }

  updateGuest(guest) {
    return this.guestRepository.updateGuest(guest);
  }
}
