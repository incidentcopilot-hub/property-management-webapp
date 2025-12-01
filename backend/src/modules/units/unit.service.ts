import { Unit } from './unit.model';

export class UnitService {
  constructor() {}

  async getAll(): Promise<Unit[]> {
    return [];
  }

  async getById(id: string): Promise<Unit | null> {
    return null;
  }

  async getByPropertyId(propertyId: string): Promise<Unit[]> {
    return [];
  }

  async create(data: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> {
    const now = new Date();
    return {
      id: 'temp-id',
      createdAt: now,
      updatedAt: now,
      ...data,
    };
  }

  async update(id: string, data: Partial<Omit<Unit, 'id' | 'createdAt'>>): Promise<Unit | null> {
    return null;
  }

  async delete(id: string): Promise<void> {
    return;
  }
}
