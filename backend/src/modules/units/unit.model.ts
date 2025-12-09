export type UnitStatus = 'VACANT' | 'OCCUPIED';

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  rentAmount: number;
  status: UnitStatus;
  tenants?: { id: string; name: string; email?: string | null; phone: string }[];
  createdAt: Date;
  updatedAt: Date;
}
