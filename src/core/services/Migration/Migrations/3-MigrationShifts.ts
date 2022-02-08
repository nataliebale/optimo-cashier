import { ShiftAction, ShiftActionType } from './../../../infrastructure/Entities';
import { Container } from 'inversify';
import { ApplicationDb } from '../../../infrastructure/ApplicationDb';

export default class MigrationShifts {
  public async run(diConainer: Container) {
    const db = diConainer.get(ApplicationDb);
    const openedShifts = await db.shiftRepository.find({ where: { finished: false } });
    for (const openedShift of openedShifts) {
      await db.shiftActionRepository.save(
        ShiftAction.CreateNew(
          ShiftActionType.Start,
          openedShift.id,
          openedShift.startOperatorId,
          openedShift.cashBegin,
          openedShift.dateBegin
        )
      );
    }
  }
}
