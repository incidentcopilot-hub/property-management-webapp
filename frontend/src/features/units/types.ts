export type UnitStatus = 'VACANT' | 'OCCUPIED' | string;

export type Unit = {
  id: string;
  propertyId?: string;
  unitNumber: string;
  rentAmount: number;
  status: UnitStatus;
  tenants?: Array<{
    id: string;
    name: string;
    email?: string;
    phone: string;
  }>;
};
