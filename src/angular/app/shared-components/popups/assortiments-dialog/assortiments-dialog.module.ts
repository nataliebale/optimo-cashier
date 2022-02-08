import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssortimentsDialogComponent } from './assortiments-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [AssortimentsDialogComponent],
  entryComponents: [AssortimentsDialogComponent],
  exports: [AssortimentsDialogComponent],
  imports: [CommonModule, MatDialogModule, IconModule],
})
export class AssortimentsDialogModule {}
