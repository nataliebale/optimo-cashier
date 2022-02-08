import { ApplicationDb } from '../infrastructure/ApplicationDb';
import { ITableWithStatus } from '../../shared/types/ITableWithStatus';
import { ISpaceWithActiveChecks } from '../../shared/types/ISpaceWithActiveChecks';

export class SpaceQueries {
  constructor(private readonly _db: ApplicationDb) {}

  async getSpacesWithActiveChecks(): Promise<ISpaceWithActiveChecks[]> {
    const query = `
      SELECT s.*, count(c."id") "checks" FROM "space" s
      LEFT JOIN "table" t
      ON t."spaceId" = s."Id"
      LEFT JOIN "check" c
      ON c."tableId" = t."Id"
      WHERE s."status" = 1
      GROUP BY s."id", s."name", s."status"
    `;
    return (await this._db.spaceRepository.query(query)) as ISpaceWithActiveChecks[];
  }

  async getTablesWithStatus(spaceId: number): Promise<ITableWithStatus[]> {
    const query = `
    SELECT  t.id AS id,
            t.name AS name,
            t.arrangement AS arrangement,
            c.guestCount AS numberOfGuests,
            c.operatorId AS operatorId,
            o.name as operatorName,
    CASE WHEN c.guestCount IS NOT NULL THEN 1 ELSE 2 END AS tableStatus
    FROM "table" t 
    LEFT JOIN "check" c ON t.id = c.tableId
	  LEFT JOIN "operator" o ON c.operatorId = o.id
    WHERE t.status = 1 AND t.spaceId = ${spaceId}
    `;

    return (await this._db.tableRepository.query(query)).map(
      (tableElem) =>
        ({ ...tableElem, arrangement: JSON.parse(tableElem.arrangement) } as ITableWithStatus[])
    );
  }
}
