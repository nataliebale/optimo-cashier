import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySalesDialogComponent } from './daily-sales-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [DailySalesDialogComponent],
  entryComponents: [DailySalesDialogComponent],
  exports: [DailySalesDialogComponent],
  imports: [CommonModule, MatDialogModule, IconModule],
})
export class DailySalesDialogModule {}
