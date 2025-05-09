export class Reservation {
  constructor({
    id = null,
    guest_id,
    property_id,
    booking_source,
    currency,
    reservation_status,
    payment_status,
    advance_payment_amount,
    check_in,
    check_out,
    special_request,
    created_by,
    updated_by,
    created_at = null,
    updated_at = null,
  }) {
    this.id = id;
    this.guest_id = guest_id;
    this.property_id = property_id;
    this.booking_source = booking_source;
    this.currency = currency;
    this.reservation_status = reservation_status;
    this.payment_status = payment_status;
    this.advance_payment_amount = advance_payment_amount;
    this.check_in = check_in;
    this.check_out = check_out;
    this.special_request = special_request;
    this.created_by = created_by;
    this.updated_by = updated_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.selected_rooms = [];
    this.assigned_beds = [];
  }

  // Setter and Getter for selected rooms
  setSelectedRooms(rooms) {
    this.selected_rooms = rooms;
  }

  getSelectedRooms() {
    return this.selected_rooms;
  }

  setTotalAmount(roomId, totalAmount) {
    const index = this.selected_rooms.findIndex(
      room => room.room_type_id === roomId
    );

    this.selected_rooms[index].total_amount = totalAmount;
  }

  // setter and getter for advance payment
  setAdvancePaymentAmount(totalAmount, advancePaymentPercentage) {
    this.advance_payment_amount = totalAmount * advancePaymentPercentage;
  }

  getAdvancePaymentAmount() {
    return this.advance_payment_amount;
  }

  // Setter and Getter for beds
  setBeds(beds) {
    this.assigned_beds = beds;
  }

  getBeds() {
    return this.assigned_beds;
  }

  // Getter for number of guest
  getNumberOfRooms(roomId) {
    const selectedRooms = this.selected_rooms;
    const room = selectedRooms.find(r => r.room_type_id === roomId);

    return room.number_of_rooms;
  }

  setNumberOfRooms(room_type_id, number_of_rooms, total_amount) {
    this.selected_rooms.push({
      room_type_id,
      number_of_rooms,
      total_amount,
    });
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

  getPaymentStatus() {
    return this.payment_status;
  }

  // Getter and Setter for check-in
  getCheckIn() {
    return this.check_in;
  }

  setCheckIn(date) {
    this.check_in = date;
  }

  // Getter and Setter for check-out
  getCheckOut() {
    return this.check_out;
  }

  setCheckOut(date) {
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
