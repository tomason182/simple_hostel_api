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
    this.street = street;
    this.city = city;
    this.postal_code = postal_code;
    this.country_code = country_code;
    this.phone_number = phone_number;
    this.email = email;
    this.create_at = new Date();
    this.update_at = new Date();
  }
}

module.exports = Property;
