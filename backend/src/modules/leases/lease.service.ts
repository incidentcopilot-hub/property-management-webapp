import { prisma } from '../../prisma';
import { Lease } from './lease.model';

export class LeaseService {
  constructor() {}

  async getAll() {
    return prisma.lease.findMany({
      include: { tenant: true, unit: true },
    });
  }

  async getById(id: string) {
    return prisma.lease.findUnique({
      where: { id },
      include: { tenant: true, unit: true },
    });
  }

  async getByTenantId(tenantId: string) {
    return prisma.lease.findMany({
      where: { tenantId },
      include: { tenant: true, unit: true },
    });
  }

  async getByUnitId(unitId: string) {
    return prisma.lease.findMany({
      where: { unitId },
      include: { tenant: true, unit: true },
    });
  }

  async create(data: Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.lease.create({ data });
  }

  async update(id: string, data: Partial<Omit<Lease, 'id' | 'createdAt'>>) {
    try {
      return await prisma.lease.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string) {
    await prisma.lease.delete({ where: { id } });
  }
}
