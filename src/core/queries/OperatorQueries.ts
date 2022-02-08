import { IOperator } from './../../shared/types/IOperator';
import { Not } from 'typeorm';
import { ApplicationDb } from '../infrastructure/ApplicationDb';
import { Operator } from '../infrastructure/Entities';

export class OperatorQueries {
  constructor(
    private readonly _db: ApplicationDb
  ) { }

  async getOperators(): Promise<IOperator[]> {
    return (await this._db.operatorRepository.query(`
        SELECT 'operator'.*,
                COALESCE('operator_session'.'isLoggedIn', false) 'isLoggedIn'
        FROM 'operator'
        LEFT JOIN (
            SELECT true 'isLoggedIn',
                'operator_session'.'operatorId'
            FROM 'operator_session'
            WHERE 'operator_session'.'logoutDate' is null
        ) as 'operator_session'
        ON 'operator'.'id' = 'operator_session'.'operatorId'
        WHERE 'operator'.'status' != 99`) as IOperator[])
      .map(item => {
        item.permissions = JSON.parse(item.permissions as any)
        return item;
      });
  }

  async countOperators(): Promise<number> {
    return await this._db.operatorRepository.count({
      where: {
        status: Not(99)
      }
    });
  }

  async getOperator(id: number): Promise<Operator> {
    return await this._db.operatorRepository.findOne({
      where: { id }
    });
  }
}
