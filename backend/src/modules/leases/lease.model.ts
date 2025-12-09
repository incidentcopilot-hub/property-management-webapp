export interface Lease {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: Date;
  endDate?: Date | null;
  documentUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
