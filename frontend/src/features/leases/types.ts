export type Lease = {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate?: string | null;
  documentUrl?: string | null;
  unit?: {
    id: string;
    unitNumber: string;
    propertyId: string;
  };
};
