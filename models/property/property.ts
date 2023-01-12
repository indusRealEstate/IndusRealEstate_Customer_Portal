export class Property {
  user_id: string;
  property_id: string;
  property_name: string;
  property_address: string;
  image: string;
  rented: string;
  leased: string;
  sold: string;
  rent_details: string;
  lease_details: string;
  sold_details: string;

  constructor(
    user_id: string,
    property_id: string,
    property_name: string,
    property_address: string,
    image: string,
    rented: string,
    leased: string,
    sold: string,
    rent_details: string,
    lease_details: string,
    sold_details: string
  ) {
    this.user_id = user_id;
    this.property_id = property_id;
    this.property_name = property_name;
    this.property_address = property_address;
    this.image = image;
    this.rented = rented;
    this.leased = leased;
    this.sold = sold;
    this.rent_details = rent_details;
    this.lease_details = lease_details;
    this.sold_details = sold_details;
  }
}
