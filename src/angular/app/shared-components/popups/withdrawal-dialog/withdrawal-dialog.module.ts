import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WithdrawalDialogComponent } from './withdrawal-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { NumpadModule } from '../../numpad/numpad.module';
import { IconModule } from '../../icon/icon.module';
import { FocusOutModule } from '../../../core/directives/focus-out.directive';

@NgModule({
  declarations: [WithdrawalDialogComponent],
  entryComponents: [WithdrawalDialogComponent],
  exports: [WithdrawalDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
    NumpadModule,
    IconModule,
    FocusOutModule,
  ],
})
export class WithdrawalDialogModule {}
