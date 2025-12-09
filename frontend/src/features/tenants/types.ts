export type Tenant = {
  id: string;
  unitId: string;
  name: string;
  phone: string;
  email?: string;
  unit?: {
    id: string;
    unitNumber: string;
    propertyId: string;
  };
};
