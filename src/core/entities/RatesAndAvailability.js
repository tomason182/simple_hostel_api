export class RateAndAvailability {
  constructor({
    id = null,
    room_type_id,
    property_id,
    start_date,
    end_date,
    custom_rate,
    rooms_to_sell,
    created_by,
    created_at,
  }) {
    this.id = id;
    this.room_type_id = room_type_id;
    (this.property_id = property_id), (this.start_date = start_date);
    this.end_date = end_date;
    this.custom_rate = custom_rate;
    this.rooms_to_sell = rooms_to_sell;
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
  getRoomsToSell() {
    return this.rooms_to_sell;
  }

  setRoomsToSell(rooms) {
    this.rooms_to_sell = rooms;
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

  // Getter and Setter for property ID
  getPropertyId() {
    return this.property_id;
  }

  setPropertyId(id) {
    this.property_id = id;
  }
}
