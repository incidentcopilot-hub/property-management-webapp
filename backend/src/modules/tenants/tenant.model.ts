export interface Tenant {
  id: string;
  unitId: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}
