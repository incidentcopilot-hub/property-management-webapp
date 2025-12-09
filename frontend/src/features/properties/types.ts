export type PropertyType = 'APARTMENT' | 'HOUSE';
export type OccupancyStatus = 'VACANT' | 'OCCUPIED';

export type Property = {
  id: string;
  name: string;
  address: string;
  propertyType: PropertyType;
  occupancy?: OccupancyStatus;
  monthlyRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  country?: string;
  units?: { id: string }[];
};
