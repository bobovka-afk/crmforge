import { ExternalLead } from '../interfaces';

export interface DealUpsertInput {
  externalId: string;
  title: string;
  amount?: number;
  currency?: string;
  status: string;
  stage?: string;
  contactName?: string;
  rawPayload?: Record<string, unknown>;
}

export function mapExternalLeadToDealInput(lead: ExternalLead): DealUpsertInput {
  return {
    externalId: lead.externalId,
    title: lead.title,
    amount: lead.amount,
    currency: lead.currency ?? 'RUB',
    status: lead.status,
    stage: lead.stage,
    contactName: lead.contactName,
    rawPayload: lead.rawPayload,
  };
}
