import { prisma } from '../../prisma';
import { Unit } from './unit.model';

export class UnitService {
  constructor() {}

  async getAll(): Promise<Unit[]> {
    return prisma.unit.findMany();
  }

  async getById(id: string): Promise<Unit | null> {
    return prisma.unit.findUnique({ where: { id } });
  }

  async getByPropertyId(propertyId: string): Promise<Unit[]> {
    return prisma.unit.findMany({ where: { propertyId } });
  }

  async create(data: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> {
    return prisma.unit.create({ data });
  }

  async update(id: string, data: Partial<Omit<Unit, 'id' | 'createdAt'>>): Promise<Unit | null> {
    try {
      return await prisma.unit.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.unit.delete({ where: { id } });
  }
}
