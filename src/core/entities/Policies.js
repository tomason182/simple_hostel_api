export class Policies {
  constructor({
    min_length_stay = 0,
    max_length_stay = 0,
    min_advance_booking = 0,
    check_in_from = null,
    check_in_to = null,
    check_out_until = null,
  }) {
    this.reservationPolicies = {
      min_length_stay: min_length_stay,
      max_length_stay: max_length_stay,
      min_advance_booking: min_advance_booking,
      check_in_from: check_in_from,
      check_in_to: check_in_to,
      check_out_until: check_out_until,
      payment_methods_accepted: [],
      online_payment_methods_accepted: [],
    };
  }

  // Getter for payment methods accepted
  getPaymentMethods() {
    return this.reservationPolicies.payment_methods_accepted;
  }

  setPaymentMethods(methodsIds) {
    if (!Array.isArray(methodsIds)) return false;

    for (const id of methodsIds) {
      this.reservationPolicies.payment_methods_accepted.push(id);
    }
  }

  // Getter and setter for online payment methods
  getOnlinePaymentMethods() {
    return this.reservationPolicies.online_payment_methods_accepted;
  }

  setOnlinePaymentMethods(methodsIds) {
    if (!Array.isArray(methodsIds)) return false;

    for (const id of methodsIds) {
      this.reservationPolicies.online_payment_methods_accepted.push(id);
    }
  }

  // getter and setter for min length of stay
  getMinLengthOfStay() {
    return this.reservationPolicies.min_length_stay;
  }

  setMinLengthOfStay(nights) {
    this.reservationPolicies.min_length_stay = nights;
  }

  // Getter and Setter for max_length stay
  getMaxLengthStay() {
    return this.reservationPolicies.max_length_stay;
  }

  setMaxLengthOfStay(nights) {
    this.reservationPolicies.max_length_stay = nights;
  }

  // Getter and setter for min advance booking
  getMinAdvanceBooking() {
    return this.reservationPolicies.min_advance_booking;
  }
  setMinAdvanceBooking(days) {
    this.reservationPolicies.min_advance_booking = days;
  }

  // Getter and setter for check in from
  getCheckInFrom() {
    return this.reservationPolicies.check_in_from;
  }
  setCheckInFrom(time) {
    this.reservationPolicies.check_in_from = time;
  }

  // Getter and Setter for check in to
  getCheckInTo() {
    return this.reservationPolicies.check_in_to;
  }

  // Getter and setter for check out until
  getCheckOutUntil() {
    return this.reservationPolicies.check_out_until;
  }
}
