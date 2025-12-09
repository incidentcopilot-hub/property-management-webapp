import { prisma } from '../../prisma';
import { Tenant } from './tenant.model';

export class TenantService {
  constructor() {}

  async getAll() {
    return prisma.tenant.findMany({
      include: { unit: true },
    });
  }

  async getById(id: string) {
    return prisma.tenant.findUnique({
      where: { id },
      include: { unit: true, leases: true },
    });
  }

  async create(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.tenant.create({ data });
  }

  async update(id: string, data: Partial<Omit<Tenant, 'id' | 'createdAt'>>) {
    try {
      return await prisma.tenant.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string) {
    await prisma.tenant.delete({ where: { id } });
  }
}
