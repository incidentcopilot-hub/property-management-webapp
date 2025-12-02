import { prisma } from '../../prisma';
import { Property } from './property.model';

export class PropertyService {
  constructor() {}

  async getAll(): Promise<Property[]> {
    const properties = await prisma.property.findMany({ include: { units: true } });
    return properties.map((property) => ({
      ...property,
      propertyType: property.propertyType ?? 'APARTMENT',
      monthlyRent: property.monthlyRent ?? undefined,
      occupancy: property.occupancy ?? 'VACANT',
      bedrooms: property.bedrooms ?? undefined,
      bathrooms: property.bathrooms ?? undefined,
      city: property.city ?? undefined,
      country: property.country ?? undefined,
      units: property.units ?? [],
    }));
  }

    async getById(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: { units: true },
    });
  }

  async create(data: {
    name: string;
    address: string;
    propertyType?: 'APARTMENT' | 'HOUSE';
    monthlyRent?: number;
    occupancy?: 'VACANT' | 'OCCUPIED';
    bedrooms?: number;
    bathrooms?: number;
    city?: string;
    country?: string;
  }) {
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
