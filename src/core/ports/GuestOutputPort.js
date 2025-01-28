export class GuestOutputPort {
  constructor(guestRepository) {
    this.guestRepository = guestRepository;
  }

  findGuestByEmail(email, propertyId, conn = null) {
    return this.guestRepository.findGuestByEmail(email, propertyId, conn);
  }
}
