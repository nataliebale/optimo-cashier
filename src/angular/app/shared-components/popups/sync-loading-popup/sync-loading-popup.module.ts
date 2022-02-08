import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncLoadingPopupComponent } from './sync-loading-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [SyncLoadingPopupComponent],
  entryComponents: [SyncLoadingPopupComponent],
  exports: [SyncLoadingPopupComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, IconModule],
})
export class SyncLoadingPopupModule {}
