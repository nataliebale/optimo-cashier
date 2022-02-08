import { ApplicationDb } from './../../../infrastructure/ApplicationDb';
import { Container } from 'inversify';
import { SettingsService } from '../../Settings/SettingService';

export default class MigrationOrperatorResync {
  public async run(diConainer: Container) {
    if (diConainer.get(SettingsService).data.isInited) {
      const db = diConainer.get(ApplicationDb);
      const oldOperators = await db.query(`SELECT * FROM "old_operator"`);
      for (const oldOperator of oldOperators) {
        await db.operatorRepository.update(oldOperator.id, {
          permissions: {
            canDeleteBasket: !!oldOperator.canDeleteBasket,
            canDeleteFromBasket: !!oldOperator.canDeleteFromBasket,
            canChangePrice: !!oldOperator.canChangePrice,
            canSetDiscount: !!oldOperator.canSetDiscount,
            canReceivePurchaseOrders: !!oldOperator.canReceivePurchaseOrders,
            canSeeAllOrders: true,
            canOrder: true,
            canOpenShift: true,
            canSeeShiftSums: true,
            canWithdrawCash: true,
          },
        });
      }
      await db.query(`DROP TABLE "old_operator"`);
    }
  }
}
