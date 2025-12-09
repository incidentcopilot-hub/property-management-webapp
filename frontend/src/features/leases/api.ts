import { fetchJSON } from '../../services/api';
import { Lease } from './types';

export const getLeasesByTenant = (tenantId: string) =>
  fetchJSON<Lease[]>(`/leases/by-tenant/${tenantId}`);

type CreateLeaseInput = {
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate?: string;
  documentUrl?: string;
};

export const createLease = (input: CreateLeaseInput) =>
  fetchJSON<Lease>('/leases', {
    method: 'POST',
    body: JSON.stringify(input),
  });
