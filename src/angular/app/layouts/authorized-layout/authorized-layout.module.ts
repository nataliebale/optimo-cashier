import { HeadbarSyncComponent } from './headbar/sync/headbar-sync.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthorizedLayoutComponent } from './authorized-layout.component';
import { HeadbarComponent } from './headbar/headbar.component';
import { DialogPopupModule } from './../../shared-components/popups/dialog-popup/dialog-popup.module';
import { SyncLoadingPopupModule } from '../../shared-components/popups/sync-loading-popup/sync-loading-popup.module';
import { WifiPopupModule } from './../../shared-components/popups/wifi-popup/wifi-popup.module';
import { LoaderPopupModule } from '../../shared-components/popups/loader-popup/loader-popup.module';
import { WithdrawalDialogModule } from '../../shared-components/popups/withdrawal-dialog/withdrawal-dialog.module';
import { DailySalesDialogModule } from '../../shared-components/popups/daily-sales-dialog/daily-sales-dialog.module';
import { FocusOutModule } from '../../core/directives/focus-out.directive';
import { InputDialogModule } from '../../shared-components/popups/input-dialog/input-dialog.module';
import { NgLetModule } from '../../core/directives/ngLet.directive';
import { IconModule } from './../../shared-components/icon/icon.module';
import { BurgerMenuDialogModule } from './../../shared-components/popups/burger-menu-dialog/burger-menu-dialog.module';
import { MessagePopupModule } from '../../shared-components/popups/message-popup/message-popup.module';
import { HeadbarUpdateComponent } from './headbar/update/headbar-update.component';

import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    DialogPopupModule,
    LoaderPopupModule,
    SyncLoadingPopupModule,
    WifiPopupModule,
    InputDialogModule,
    WithdrawalDialogModule,
    DailySalesDialogModule,
    FocusOutModule,
    NgLetModule,
    IconModule,
    BurgerMenuDialogModule,
    MessagePopupModule,
    MatSelectModule,
    FormsModule,
  ],
  declarations: [
    AuthorizedLayoutComponent,
    HeadbarComponent,
    HeadbarSyncComponent,
    HeadbarUpdateComponent,
  ],
  exports: [AuthorizedLayoutComponent],
})
export class AuthorizedLayoutModule {}
