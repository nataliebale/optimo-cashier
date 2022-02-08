import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderPopupComponent } from './loader-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [LoaderPopupComponent],
  entryComponents: [LoaderPopupComponent],
  exports: [LoaderPopupComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, IconModule],
})
export class LoaderPopupModule {}
