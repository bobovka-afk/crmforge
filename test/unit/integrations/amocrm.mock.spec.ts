import { buildMockLeads, paginateMockLeads } from '../../../src/integrations/amocrm/amocrm.mock';

describe('AmoCrm mock', () => {
  it('builds 20 mock leads', () => {
    const leads = buildMockLeads();
    expect(leads).toHaveLength(20);
    expect(leads[0].externalId).toBe('1000');
  });

  it('paginates mock leads', () => {
    const leads = buildMockLeads(20);
    const page = paginateMockLeads(leads, 2, 5);
    expect(page).toHaveLength(5);
    expect(page[0].externalId).toBe('1005');
  });
});
