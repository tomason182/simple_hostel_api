export class ReservationTransactionManagerPort {
  constructor(
    reservationRepository,
    guestRepository,
    ratesAndAvailabilityRepository,
    availabilityService,
    emailService,
    bedAssignmentService
  ) {
    this.reservationRepository = reservationRepository;
    this.guestRepository = guestRepository;
    this.ratesAndAvailabilityRepository = ratesAndAvailabilityRepository;
    this.availabilityService = availabilityService;
    this.bedAssignmentService = bedAssignmentService;
    this.emailService = emailService;
  }

  // GUEST SERVICES.
  // Create guest
  saveGuest(guest, propertyId, conn = null) {
    return this.guestRepository.save(guest, propertyId, conn);
  }
  // Update guest
  updateGuest(guest, conn = null) {
    return this.guestRepository.update(guest, conn);
  }
  // Find guest
  findGuestByEmail(email, propertyId, conn = null) {
    return this.guestRepository.findGuestByEmail(email, propertyId, conn);
  }

  // RESERVATION SERVICES
  // Create reservation
  saveReservation(reservation, conn = null) {
    return this.reservationRepository.save(reservation, conn);
  }

  // Update reservations beds
  updateAssignedBed(id, bed, conn) {
    return this.reservationRepository.updateAssignedBed(id, bed, conn);
  }

  // RATES AND AVAILABILITY SERVICES.
  // Get all the rates and availability ranges
  getAllRanges(selectedRooms, checkIn, checkOut, conn = null) {
    return this.ratesAndAvailabilityRepository.getAllRanges(
      selectedRooms,
      checkIn,
      checkOut,
      conn
    );
  }

  // AVAILABILITY SERVICE
  // Check Availability Service.
  checkAvailabilityAndAssignBeds(
    room,
    ranges,
    propertyId,
    checkIn,
    checkOut,
    conn = null
  ) {
    return this.availabilityService.checkAvailabilityAndAssignBeds(
      room,
      ranges,
      propertyId,
      checkIn,
      checkOut,
      conn
    );
  }

  // EMAIL SERVICES
  sendEmailToGuest(to, subject, body, from) {
    return this.emailService.sendEmail(to, subject, body, from);
  }
}
