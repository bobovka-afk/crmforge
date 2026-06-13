import { ExternalLead } from '../interfaces';

const STATUSES = ['new', 'in_progress', 'negotiation', 'won', 'lost'] as const;

export function buildMockLeads(count = 20): ExternalLead[] {
  return Array.from({ length: count }, (_, index) => {
    const id = String(1000 + index);
    return {
      externalId: id,
      title: `Mock Lead #${index + 1}`,
      amount: 10000 + index * 1500,
      currency: 'RUB',
      status: STATUSES[index % STATUSES.length],
      stage: `Stage ${(index % 4) + 1}`,
      contactName: `Contact ${index + 1}`,
      rawPayload: { id, mock: true },
    };
  });
}

export function paginateMockLeads(
  leads: ExternalLead[],
  page: number,
  limit: number,
): ExternalLead[] {
  const start = (page - 1) * limit;
  return leads.slice(start, start + limit);
}
