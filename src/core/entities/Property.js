export class Property {
  constructor({
    id = null,
    property_name = null,
    country = null,
    alpha_2_code = null,
    state = null,
    city = null,
    postal_code = null,
    house_number = null,
    street = null,
    house_number = null,
    lat = null,
    lon = null,
    osm_id = null,
    country_code = null,
    phone_number = null,
    email = null,
    base_currency = null,
    payment_currency = null,
    created_at = null,
    updated_at = null,
  }) {
    this.id = id;
    this.property_name = property_name;
    this.address = {
      house_number,
      street,
      city,
      postal_code,
      alpha_2_code,
      state,
      country,
      lat,
      lon,
      osm_id,
    };
    this.contact_info = {
      phone_number,
      country_code,
      email,
    };
    this.currencies = {
      base_currency,
      payment_currency,
    };

    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Setter and Getter for ID
  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  // Getter and setter Property name
  setPropertyName(name) {
    this.property_name = name;
  }

  getPropertyName() {
    return this.property_name;
  }

  // Getter and Setter phone number
  setPhoneNumber(phone_number) {
    this.contact_info.phone_number = phone_number;
  }

  getPhoneNumber() {
    return this.contact_info.phone_number;
  }

  // Getter and Setter for country code
  getCountryCode() {
    return this.contact_info.country_code;
  }

  setCountryCode(country_code) {
    this.contact_info.country_code = country_code;
  }

  // Getter and Setter email
  setEmail(email) {
    this.contact_info.email = email;
  }

  getEmail() {
    return this.contact_info.email;
  }

  // Getter and setter for street
  getStreet() {
    return this.address.street;
  }

  setStreet(street) {
    this.address.street = street;
  }

  getHouseNumber() {
    return this.address.house_number;
  }

  // Getter and Setter for city
  getCity() {
    return this.address.city;
  }

  setCity(city) {
    this.address.city = city;
  }

  // Getter and Setter for postal code
  getPostalCode() {
    return this.address.postal_code;
  }

  setPostalCode(postal_code) {
    this.address.postal_code = postal_code;
  }

  // Getter ans Setter for location
  getAlpha2Code() {
    return this.address.alpha_2_code;
  }

  getLat() {
    return this.address.lat;
  }

  getLon() {
    return this.address.lon;
  }

  getOsmId() {
    return this.address.osm_id;
  }

  getState() {
    return this.address.state;
  }

  getCountry() {
    return this.address.country;
  }

  // Setter for currencies
  setBaseCurrency(currency) {
    this.currencies.base_currency = currency;
  }

  setPaymentCurrency(currency) {
    this.currencies.payment_currency = currency;
  }

  getBaseCurrency() {
    return this.currencies.base_currency;
  }

  getPaymentCurrency() {
    return this.currencies.payment_currency;
  }
}
