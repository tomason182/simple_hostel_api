export class Reservation {
  constructor({
    id = null,
    guest_id,
    property_id,
    booking_source,
    currency,
    reservation_status,
    payment_status,
    check_in,
    check_out,
    special_request,
    created_by,
    updated_by,
    created_at = null,
    updated_at = null,
  }) {
    this.id = id;
    this.guest = guest_id;
    this.property_id = property_id;
    this.booking_source = booking_source;
    this.currency = currency;
    this.reservation_status = reservation_status;
    this.payment_status = payment_status;
    this.check_in = check_in;
    this.check_out = check_out;
    this.special_request = special_request;
    this.created_by = created_by;
    this.updated_by = updated_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.selected_rooms = [
      {
        room_type_id: null,
        number_of_guests: null,
        total_amount: null,
      },
    ];
  }

  // Setter and Getter for selected rooms
  setSelectedRooms(rooms) {
    for (const room in rooms) {
      this.selected_rooms = {
        room_type_id: room.id,
        number_of_guests: room.guests,
        total_amount: room.amount,
      };
    }
  }

  getSelectedRooms() {
    return this.selected_rooms;
  }

  // Setter and Getter for ID
  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  // Setter and Getter for guest id
  getGuestId() {
    return this.guest_id;
  }
  setGuestId(id) {
    this.guest_id = id;
  }

  // Setter and Getter for property id
  getPropertyId() {
    return this.property_id;
  }
  setPropertyId(id) {
    this.property_id = id;
  }

  // Setter and Getter for booking source
  getBookingSource() {
    return this.booking_source;
  }

  setBookingSource(source) {
    this.booking_source = source;
  }

  // Getter and Setter for currency.
  getCurrency() {
    return this.currency;
  }

  setCurrency(currency) {
    this.currency = currency;
  }

  // Getter and Setter for reservation status
  getReservationStatus() {
    return this.reservation_status;
  }

  setReservationStatus(status) {
    this.reservation_status = status;
  }

  // Getter and Setter for check-in
  getCheckIn() {
    return this.check_in;
  }

  setCheckIn(checkIn) {
    const date = formatDate(checkIn); // formatDate not implemented yet.
    this.check_in = date;
  }

  // Getter and Setter for check-out
  getCheckOut() {
    return this.check_out;
  }

  setCheckOut(checkOut) {
    const date = formatDate(checkOut);
    this.check_out = date;
  }

  // Getter and Setter for special request
  getSpecialRequest() {
    return this.special_request;
  }

  setSpecialRequest(text) {
    this.special_request = text;
  }

  // Getter and Setter for created by
  setCreateBy(userId) {
    this.created_by = userId;
  }

  getCreatedBy() {
    return this.created_by;
  }
}
