import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NumpadModule } from '../../numpad/numpad.module';
import { NgxMaskModule } from 'ngx-mask';
import { InputDialogComponent } from './input-dialog.component';

@NgModule({
  declarations: [InputDialogComponent],
  entryComponents: [InputDialogComponent],
  exports: [InputDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    NumpadModule,
    NgxMaskModule.forRoot(),
  ],
})
export class InputDialogModule {}
