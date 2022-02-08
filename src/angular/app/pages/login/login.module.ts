import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { LoginComponent } from './login.component';
import { OperatorsListComponent } from './operators-list/operators-list.component';
import { SynchronizationComponent } from './synchronization/synchronization.component';
import { SyncLoadingPopupModule } from '../../shared-components/popups/sync-loading-popup/sync-loading-popup.module';
import { NotifierPopupModule } from '../../shared-components/popups/notifier-popup/notifier-popup.module';
import { PincodeComponent } from './pincode/pincode.component';
import { NumpadModule } from '../../shared-components/numpad/numpad.module';
import { IconModule } from '../../shared-components/icon/icon.module';
import { BurgerMenuDialogModule } from '../../shared-components/popups/burger-menu-dialog/burger-menu-dialog.module';
import { MessagePopupModule } from '../../shared-components/popups/message-popup/message-popup.module';

@NgModule({
  imports: [
    CommonModule,
    SyncLoadingPopupModule,
    MatDialogModule,
    FormsModule,
    NumpadModule,
    NotifierPopupModule,
    IconModule,
    MatDialogModule,
    BurgerMenuDialogModule,
    MessagePopupModule,
  ],
  declarations: [
    LoginComponent,
    PincodeComponent,
    OperatorsListComponent,
    SynchronizationComponent,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
