import { Not, Like } from 'typeorm';
import { ApplicationDb } from '../infrastructure/ApplicationDb';
import { Supplier } from '../infrastructure/Entities';

export class SupplierQueries {
  constructor(private readonly _db: ApplicationDb) {}

  async getSuppliers(pageIndex: number, pageSize: number, name: string): Promise<Supplier[]> {
    let query;

    if (!name) {
      name = '';
    }

    query = {
      where: {
        status: Not(99),
        name: Like(`%${name}%`),
      },
      order: { name: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };
    return await this._db.supplierRepository.find(query);
  }

  async countSuppliers(name: string): Promise<number> {
    let query;

    if (!name) {
      name = '';
    }

    query = {
      where: {
        name: Like(`%${name}%`),
        status: Not(99),
      },
    };
    return await this._db.supplierRepository.count(query);
  }
}
