import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { GuestsDetailsComponent } from './guests-details.component';
import { IconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [GuestsDetailsComponent],
  entryComponents: [GuestsDetailsComponent],
  exports: [GuestsDetailsComponent],
  imports: [CommonModule, MatDialogModule, IconModule],
})
export class GuestsDetailsModule {}
