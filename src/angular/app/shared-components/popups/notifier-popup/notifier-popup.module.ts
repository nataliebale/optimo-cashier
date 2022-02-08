import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierPopupComponent } from './notifier-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [NotifierPopupComponent],
  entryComponents: [NotifierPopupComponent],
  exports: [NotifierPopupComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, IconModule],
})
export class NotifierPopupModule {}
