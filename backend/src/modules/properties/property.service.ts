import { Property } from './property.model';

export class PropertyService {
  constructor() {}

  async getAll(): Promise<Property[]> {
    return []; // TODO: replace with DB call
  }

  async getById(id: string): Promise<Property | null> {
    return null; // TODO
  }

  async create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const now = new Date();
    return {
      id: 'temp-id',
      createdAt: now,
      updatedAt: now,
      ...data,
    };
  }

  async update(id: string, data: Partial<Omit<Property, 'id' | 'createdAt'>>): Promise<Property | null> {
    return null; // TODO
  }

  async delete(id: string): Promise<void> {
    return; // TODO
  }
}
