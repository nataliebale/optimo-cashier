import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MessagePopupComponent } from './message-popup.component';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [MessagePopupComponent],
  entryComponents: [MessagePopupComponent],
  exports: [MessagePopupComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, IconModule],
})
export class MessagePopupModule {}
