import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurgerMenuDialogComponent } from './burger-menu-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogPopupModule } from '../dialog-popup/dialog-popup.module';
import { LoaderPopupModule } from '../loader-popup/loader-popup.module';
import { SyncLoadingPopupModule } from '../sync-loading-popup/sync-loading-popup.module';
import { WifiPopupModule } from '../wifi-popup/wifi-popup.module';
import { InputDialogModule } from '../input-dialog/input-dialog.module';
import { WithdrawalDialogModule } from '../withdrawal-dialog/withdrawal-dialog.module';
import { DailySalesDialogModule } from '../daily-sales-dialog/daily-sales-dialog.module';
import { NgLetModule } from '../../../core/directives/ngLet.directive';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [BurgerMenuDialogComponent],
  entryComponents: [BurgerMenuDialogComponent],
  exports: [BurgerMenuDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    DialogPopupModule,
    LoaderPopupModule,
    SyncLoadingPopupModule,
    WifiPopupModule,
    InputDialogModule,
    WithdrawalDialogModule,
    DailySalesDialogModule,
    IconModule,
    NgLetModule,
  ],
})
export class BurgerMenuDialogModule {}
