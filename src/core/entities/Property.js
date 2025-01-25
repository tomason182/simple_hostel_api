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

  // Setter for currencies
  setCurrencies(base_currency = null, payment_currency = null) {
    this.currencies = {
      base_currency,
      payment_currency,
    };
  }
}
