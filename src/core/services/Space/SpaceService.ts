import { ISpaceWithActiveChecks } from './../../../shared/types/ISpaceWithActiveChecks';
import { injectable, inject } from 'inversify';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { Space } from '../../infrastructure/Entities';
import { SpaceQueries } from '../../queries/SpaceQueries';

@injectable()
export class SpaceService {
  public currentShiftId?: number;

  constructor(@inject(ApplicationDb) private readonly _db: ApplicationDb) {}

  async getSpaces(): Promise<ISpaceWithActiveChecks[]> {
    return await new SpaceQueries(this._db).getSpacesWithActiveChecks();
  }

  async getSpaceById(spaceId: number): Promise<Space> {
    return await this._db.spaceRepository.findOne(spaceId);
  }
}
