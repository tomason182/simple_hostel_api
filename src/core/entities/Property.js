export class Property {
  constructor({
    id = null,
    property_name,
    street = null,
    city = null,
    postal_code = null,
    country_code = null,
    phone_number = null,
    email = null,
    base_currency = null,
    payment_currency = null,
  }) {
    this.id = id;
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
    this.currencies = {
      base_currency,
      payment_currency,
    };
    this.policies = {
      payment_method: [],
      deposit_amount: 0,
      check_in: {
        from: null,
        to: null,
      },
      check_out: {
        from: null,
        to: null,
      },
      cancellation_policy: {
        allow_cancellation: false,
        days: 0,
      },
      allow_pets: false,
      minors_policy: {
        allow: false,
        room_types: null, // all rooms | private rooms | null
      },
      description: null,
    };

    this.create_at = null;
    this.update_at = null;
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

  // Getter and Setter for city
  getCity() {
    return this.address.city;
  }

  // Getter and Setter for country code
  getCountryCode() {
    return this.address.country_code;
  }

  // Getter and Setter for postal code
  getPostalCode() {
    return this.address.postal_code;
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
