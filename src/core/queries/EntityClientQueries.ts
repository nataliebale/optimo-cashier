import { IEntityClient } from '../../shared/types/IEntityClient';
import { ApplicationDb } from '../infrastructure/ApplicationDb';

export class EntityClientQueries {
  constructor(private readonly _db: ApplicationDb) {}

  async getAllEntityClients(): Promise<IEntityClient[]> {
    return await this._db.entityClientRepository.query(
      `
        SELECT * FROM 'entity_client'
        WHERE 'entity_client'.'status' != 99
        ORDER BY case when dashboardpriority is null then 1 else 0 end, dashboardpriority, entityName
      `
    );
  }

  async getEntityClients(
    entityNameOrIdentifier: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IEntityClient[]> {
    entityNameOrIdentifier = entityNameOrIdentifier.replace("'", "\\'");
    return await this._db.entityClientRepository.query(
      `
        SELECT * FROM 'entity_client'
        WHERE 'entity_client'.'status' != 99
        AND ('entity_client'.'entityName' LIKE '%${entityNameOrIdentifier}%'
              OR 'entity_client'.'entityIdentifier' LIKE '%${entityNameOrIdentifier}%')
        ORDER BY case when dashboardpriority is null then 1 else 0 end, dashboardpriority, entityName
        LIMIT  ${pageIndex * pageSize}, ${pageSize}
      `
    );
  }

  async countEntityClients(entityNameOrIdentifier: string): Promise<number> {
    entityNameOrIdentifier = entityNameOrIdentifier.replace("'", "\\'");
    return (
      await this._db.entityClientRepository.query(
        `
        SELECT COUNT(1) as cnt
        FROM 'entity_client'
        WHERE 'entity_client'.'status' != 99
        AND ('entity_client'.'entityName' LIKE '%${entityNameOrIdentifier}%'
              OR 'entity_client'.'entityIdentifier' LIKE '%${entityNameOrIdentifier}%')
      `
      )
    )[0].cnt;
  }
}
