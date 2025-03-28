export class GuestOutputPort {
  constructor(guestRepository, propertyRepository) {
    this.guestRepository = guestRepository;
    this.propertyRepository = propertyRepository;
  }

  findGuestByEmail(email, propertyId, conn = null) {
    return this.guestRepository.findGuestByEmail(email, propertyId, conn);
  }

  findPropertyById(propertyId) {
    return this.propertyRepository.findPropertyById(propertyId);
  }

  findGuestById(id, propertyId, conn = null) {
    return this.guestRepository.findGuestById(id, propertyId, conn);
  }

  saveGuest(guest, propertyId, conn = null) {
    return this.guestRepository.saveGuest(guest, propertyId, conn);
  }

  updateGuest(guest) {
    return this.guestRepository.update(guest);
  }
}
