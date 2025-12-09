import { fetchJSON } from '../../services/api';
import { Unit } from './types';

type CreateUnitInput = {
  propertyId: string;
  unitNumber: string;
  rentAmount: number;
  status: string;
};

export const getUnits = () => fetchJSON<Unit[]>('/units');

export const getUnit = (id: string) => fetchJSON<Unit>(`/units/${id}`);

export const createUnit = (input: CreateUnitInput) =>
  fetchJSON<Unit>('/units', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const updateUnit = (id: string, data: Partial<Unit>) =>
  fetchJSON<Unit>(`/units/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
