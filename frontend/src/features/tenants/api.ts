import { fetchJSON } from '../../services/api';
import { Tenant } from './types';

export const getTenants = () => fetchJSON<Tenant[]>('/tenants');

export const getTenant = (id: string) => fetchJSON<Tenant>(`/tenants/${id}`);

type CreateTenantInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  unitId: string;
};

export const createTenant = (input: CreateTenantInput) =>
  fetchJSON<Tenant>('/tenants', {
    method: 'POST',
    body: JSON.stringify(input),
  });
