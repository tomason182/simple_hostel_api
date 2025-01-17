class Property {
  constructor({
    propertyName,
    street = null,
    city = null,
    postalCode = null,
    countryCode = null,
    phoneNumber = null,
    email = null,
  }) {
    this.propertyName = propertyName;
    this.address = {
      street,
      city,
      postalCode,
      countryCode,
    };
    this.contactInfo = {
      phoneNumber,
      email,
    };
    this.currencies = {
      baseCurrency: null,
      paymentCurrency: null,
    };
    this.policies = {
      paymentMethod: [],
      depositAmount: 0,
      checkIn: {
        from: null,
        to: null,
      },
      checkOut: {
        from: null,
        to: null,
      },
      cancellationPolicy: {
        allowCancellation: false,
        days: 0,
      },
      allowPets: false,
      minorsPolicy: {
        allow: false,
        roomTypes: null, // all rooms | private rooms | null
      },
      description: null,
    };

    this.createAt = new Date();
    this.updateAt = new Date();
  }

  // Setter for currencies
  setCurrencies(baseCurrency = null, paymentCurrency = null) {
    this.currencies = {
      baseCurrency,
      paymentCurrency,
    };
  }

  // Update setter
  setUpdateAt() {
    this.update_at = new Date();
  }
}

module.exports = Property;

const propertyName = "La casa de tomas";
const email = "tomas@mail.com";

const property = new Property({ propertyName, email });
const phoneNumber = property.contactInfo.phoneNumber;
console.log(phoneNumber);
