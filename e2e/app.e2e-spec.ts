import { IndusRealEstateCustomerPortal } from './app.po';

describe('indus_real_estate_customer_portal App', () => {
  let page: IndusRealEstateCustomerPortal;

  beforeEach(() => {
    page = new IndusRealEstateCustomerPortal();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
