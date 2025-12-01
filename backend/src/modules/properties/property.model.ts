export interface Property {
  id: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}
