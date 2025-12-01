export type UnitStatus = 'VACANT' | 'OCCUPIED';

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  rentAmount: number;
  status: UnitStatus;
  createdAt: Date;
  updatedAt: Date;
}
