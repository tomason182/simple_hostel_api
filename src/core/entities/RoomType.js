export class RoomType {
  constructor({
    id = null,
    property_id = null,
    description,
    type,
    gender,
    max_occupancy,
    inventory,
    products = [],
    basic_amenities = [],
    comfort_amenities = [],
    hygiene_and_extras_amenities = [],
    additional_amenities = [],
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
    this.products = products;
    this.basic_amenities = basic_amenities;
    this.comfort_amenities = comfort_amenities;
    this.hygiene_and_extras_amenities = hygiene_and_extras_amenities;
    this.additional_amenities = additional_amenities;
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

  // Getter and Setter for products

  setProducts() {
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

      // Agregamos un numero de cama. El numero de cama puede repetirse. No es el ID de la cama.
      const bedsList = bedsArray.map((bed, i) => (bed = i + 1));

      const roomNum = (i + 1).toString();
      this.products.push({
        room_name: "Room" + roomNum.padStart(2, "0"),
        beds: bedsList,
      });
    }
  }

  getProducts() {
    return this.products;
  }
}
