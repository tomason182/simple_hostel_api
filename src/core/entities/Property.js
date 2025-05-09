export class Property {
  constructor({
    id = null,
    property_name = null,
    street = null,
    city = null,
    postal_code = null,
    alpha_2_code = null,
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
      street,
      city,
      postal_code,
      alpha_2_code,
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

  // Getter and Setter for alpha code
  getAlpha2Code() {
    return this.address.alpha_2_code;
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
