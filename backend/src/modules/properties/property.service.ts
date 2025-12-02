import { prisma } from '../../prisma';
import { Property } from './property.model';

export class PropertyService {
  constructor() {}

  async getAll(): Promise<Property[]> {
    const properties = await prisma.property.findMany();
    return properties.map((property) => ({
      ...property,
      city: property.city ?? undefined,
      country: property.country ?? undefined,
    }));
  }

    async getById(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: { units: true },
    });
  }

  async create(data: { name: string; address: string; city?: string; country?: string }) {
    return prisma.property.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.property.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.property.delete({ where: { id } });
  }
}
