import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumpadComponent } from './numpad.component';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [NumpadComponent],
  exports: [NumpadComponent],
  imports: [CommonModule, FormsModule, IconModule],
})
export class NumpadModule {}
