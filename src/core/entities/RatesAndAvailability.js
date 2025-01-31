export class RateAndAvailability {
  constructor({
    id = null,
    room_type_id,
    start_date,
    end_date,
    custom_rate,
    custom_availability,
    created_by,
    created_at,
  }) {
    this.id = id;
    this.room_type_id = room_type_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.custom_rate = custom_rate;
    this.custom_availability = custom_availability;
    this.created_by = created_by;
    this.created_at = created_at;
  }

  // Getter and Setter for ID
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }

  // Getter and Setter for room type id.
  getRoomTypeId() {
    return this.room_type_id;
  }
  setRoomTypeId(id) {
    this.room_type_id = id;
  }

  // Getter and Setter for start date.
  getStartDate() {
    return this.start_date;
  }

  setStartDate(date) {
    this.start_date = new Date(date).toISOString();
  }

  // Getter and Setter for end date
  getEndDate() {
    return this.end_date;
  }

  setEndDate(date) {
    this.end_date = new Date(date).toISOString();
  }

  // Getter and Setter for custom availability
  getCustomAvailability() {
    return this.custom_availability;
  }

  setCustomAvailability(availability) {
    this.custom_availability = availability;
  }

  // Getter and Setter for custom rate
  getCustomRate() {
    return this.custom_rate;
  }

  setCustomRate(rate) {
    this.custom_rate = rate;
  }

  // Getter and Setter for created by
  getCreatedBy() {
    return this.created_by;
  }

  setCreatedBy(id) {
    this.created_by = id;
  }
}
