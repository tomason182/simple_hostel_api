export class ReservationTransactionManagerPort {
  constructor(
    reservationService,
    guestService,
    checkAvailabilityService,
    bedAssignmentService,
    emailService
  ) {
    this.reservationService = reservationService;
    this.guestService = guestService;
    this.checkAvailabilityService = checkAvailabilityService;
    this.bedAssignmentService = bedAssignmentService;
    this.emailService = emailService;
  }

  // Check Availability Service.
  checkAvailability(roomTypeId, checkIn, checkOut, conn = null) {
    return this.checkAvailabilityService.checkAvailability(
      checkIn,
      checkOut,
      roomTypeId,
      conn
    );
  }
}
