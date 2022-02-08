import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPopupComponent } from './dialog-popup.component';
import { LoaderPopupModule } from '../loader-popup/loader-popup.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  entryComponents: [DialogPopupComponent],
  exports: [DialogPopupComponent],
  declarations: [DialogPopupComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, LoaderPopupModule, IconModule],
})
export class DialogPopupModule {}
