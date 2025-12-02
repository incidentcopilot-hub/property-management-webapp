export interface Property {
  id: string;
  name: string;
  address: string;
  propertyType: 'APARTMENT' | 'HOUSE';
  monthlyRent?: number;
  occupancy: 'VACANT' | 'OCCUPIED';
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  country?: string;
  units?: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
}
