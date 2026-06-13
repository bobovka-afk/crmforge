export const SYNC_QUEUE = 'sync';

export const SYNC_JOB_TYPES = {
  AMOCRM_LEADS: 'amocrm.leads',
} as const;

export interface SyncJobPayload {
  jobId: string;
  userId: string;
  provider: string;
  type: string;
}
