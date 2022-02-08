import { ApplicationDb } from '../infrastructure/ApplicationDb';
import { Check } from '../infrastructure/Entities';

export class CheckQueries {
  constructor(
    private readonly _db: ApplicationDb
  ) { }

  async getChecks(operatorId?: number, tableId?: number) {
    let filters = '';

    if (operatorId) {
      filters += ` AND 'check'.'operatorId' = ${operatorId}`;
    }

    if (tableId) {
      filters += ` AND 'check'.'tableId' = ${tableId}`;
    }

    return await this._db.checkRepository.query(`
      SELECT 'check'.'id',
             'check'.'guestCount'
      FROM 'check' 'check'
      WHERE 1 = 1 ${filters}
    `) as Check[];
  }

  async deleteOperatorUnusedCehcks(operatorId: number) {
    await this._db.checkRepository.query(
      `DELETE FROM 'check' WHERE 'check'.'operatorId' = ${operatorId} AND 'check'.'products' = '[]'`
    );
  }

  async operatorHasChecks(operatorId: number): Promise<boolean> {
    const result = await this._db.checkRepository.query(
      `SELECT count(1) count FROM 'check' WHERE 'check'.'operatorId' = ${operatorId}`
    );

    return !!result[0].count;
  }

  async operatorHasActiveChecks(operatorId: number): Promise<boolean> {
    const result = await this._db.checkRepository.query(
      `SELECT count(1) count FROM 'check'
       WHERE 'check'.'operatorId' = ${operatorId}
       AND 'check'.'products' IS NOT NULL
       AND 'check'.'products' != '[]'`
    );

    return !!result[0].count;
  }
}
