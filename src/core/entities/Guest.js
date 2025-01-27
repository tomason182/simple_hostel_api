export class Guest {
  constructor({
    id = null,
    first_name,
    last_name,
    id_number,
    email,
    phone_number,
    street,
    city,
    country_code,
    postal_code = null,
    created_by,
    updated_by = null,
    created_at = null,
    updated_at = null,
  }) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.id_number = id_number;
    this.contact_info = {
      email,
      phone_number,
    };
    this.address = {
      street,
      city,
      country_code,
      postal_code,
    };
    this.created_by = created_by;
    this.updated_by = updated_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Getter and Setter for ID
  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  // Getter and Setter for first_name
  getFirstName() {
    return this.first_name;
  }

  setFirstName(name) {
    this.first_name = name;
  }

  // Getter and Setter for last_name.
  getLastName() {
    return this.last_name;
  }

  setLastName(name) {
    this.last_name = name;
  }

  // Getter and Setter for ID number.
  getIdNumber() {
    return this.id_number;
  }

  setIdNumber(idNum) {
    this.id_number(idNum);
  }

  // Getter and Setter for email.
  getEmail() {
    return this.contact_info.email;
  }

  setEmail(email) {
    this.contact_info.email = email;
  }

  // Getter and Setter for phone number.
  getPhoneNumber() {
    return this.contact_info.phone_number;
  }

  setPhoneNumber(phoneNum) {
    this.contact_info.phone_number = phoneNum;
  }

  // Getter and Setter for street
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

  // Getter and setter for country code
  getCountryCode() {
    return this.address.country_code;
  }

  setCountryCode(countryCode) {
    this.address.country_code = countryCode;
  }

  // Getter and setter for postal code
  getPostalCode() {
    return this.address.postal_code;
  }

  setCountryCode(postalCode) {
    this.address.postal_code = postalCode;
  }

  // Getter and Setter for created by
  getCreatedBy() {
    return this.created_by;
  }

  setCreatedBy(createdBy) {
    this.created_by = createdBy;
  }

  // Getter and Setter for updated by
  getUpdatedBy() {
    return this.updated_by;
  }

  setUpdatedBy(updatedBy) {
    this.updated_by = updatedBy;
  }
}
