export class RoomType {
  constructor({
    id = null,
    property_id = null,
    description,
    type,
    gender,
    max_occupancy,
    inventory,
    base_rate,
    currency,
    amenities,
    created_at = null,
    updated_at = null,
  }) {
    this.id = id;
    this.property_id = property_id;
    this.description = description;
    this.type = type;
    this.gender = gender;
    this.max_occupancy = max_occupancy;
    this.inventory = inventory;
    this.base_rate = base_rate;
    this.currency = currency;
    this.amenities = amenities;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Getter & Setter for ID
  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  // Getter & Setter for property ID
  getPropertyId() {
    return this.property_id;
  }

  setPropertyId(newPropId) {
    this.property_id = newPropId;
  }

  // Getter & Setter for description
  getDescription() {
    return this.description;
  }

  setDescription(newDesc) {
    this.description = newDesc;
  }

  // Getter for type
  getType() {
    return this.type;
  }

  // Getter & Setter for gender
  getGender() {
    return this.gender;
  }

  setGender(newGender) {
    this.gender = newGender;
  }

  // Getter for max occupancy.
  getMaxOccupancy() {
    return this.max_occupancy;
  }

  // Getter & setter for inventory.
  getInventory() {
    return this.inventory;
  }

  setInventory(newInv) {
    this.inventory = newInv;
  }

  // Getter & setter for base rate.
  getBaseRate() {
    return this.base_rate;
  }
  
  setBaseRate(newBaseRate) {
    this.base_rate = newBaseRate;
  }

  // Getter & setter for currency.
  getCurrency() {
    return this.currency;
  }
  
  setCurrency(newCurrency) {
    this.currency = newCurrency;
  }

  // Getter & setter for amenities.
  getAmenities() {
    return this.amenities;
  }
  
  setAmenities(newListAmenities) {
    this.amenities = newListAmenities;
  }

  addAmenity(newAmenity) {
    this.amenities.push(newAmenity);  // mejorarlo para que busque si la amenity que ingreso existe o no
  }

/*  setProducts() {
    // Tal vez tengamos que limitar el numero maximo de inventory y max_occupancy en schema.
    for (let i = 0; i < this.inventory; i++) {
      let bedsArray = [];

      // Si room type es "private" le asignamos una sola cama
      // Si room type es "dorm" la cantidad de camas es igual a max_occupancy
      if (this.type === "private") {
        bedsArray = new Array(1).fill(null);
      } else {
        bedsArray = new Array(parseInt(this.max_occupancy)).fill(null);
      }

      // Agregamos un ID a cada cama
      const bedsList = bedsArray.map(() => new ObjectId());

      const roomNum = (i + 1).toString();
      this.products.push({
        room_name: "Room" + roomNum.padStart(2, "0"),
        beds: bedsList,
      });
    }
  }

  setRatesAndAvailability(
    start_date,
    end_date,
    custom_rate,
    custom_availability
  ) {
    this.rates_and_availability.push({
      start_date,
      end_date,
      custom_rate,
      custom_availability,
    });
  }*/ 

}