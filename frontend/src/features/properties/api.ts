import { fetchJSON } from '../../services/api';
import { Property, PropertyType, OccupancyStatus } from './types';
import { Unit } from '../units/types';

export const getProperties = () => fetchJSON<Property[]>('/properties');

type CreatePropertyInput = {
  name: string;
  address: string;
  propertyType: PropertyType;
  occupancy?: OccupancyStatus;
  monthlyRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  country?: string;
};

export const createProperty = (input: CreatePropertyInput) =>
  fetchJSON<Property>('/properties', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const getProperty = (id: string) => fetchJSON<Property>(`/properties/${id}`);

export const updateHouse = (id: string, payload: Pick<Property, 'monthlyRent' | 'occupancy'>) =>
  fetchJSON<Property>(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const getUnitsForProperty = (propertyId: string) =>
  fetchJSON<Unit[]>(`/units/by-property/${propertyId}`);
