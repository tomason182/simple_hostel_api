class Property {
  constructor({
    property_name,
    street = null,
    city = null,
    postal_code = null,
    country_code = null,
    phone_number = null,
    email = null,
  }) {
    this.property_name = property_name;
    this.address = {
      street,
      city,
      postal_code,
      country_code,
    };
    this.contact_info = {
      phone_number,
      email,
    };
    this.create_at = new Date();
    this.update_at = new Date();
  }

  // Update setter
  setUpdateAt() {
    this.update_at = new Date();
  }
}

module.exports = Property;
