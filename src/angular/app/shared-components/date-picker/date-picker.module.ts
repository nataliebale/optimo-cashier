import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { FormsModule } from '@angular/forms';
import { FocusOutModule } from '../../core/directives/focus-out.directive';
// import { IconModule } from '@optimo/ui-icon';
// import { ClickOutsideModule } from '@optimo/util-click-outside';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // IconModule,
    // ClickOutsideModule,
    FocusOutModule,
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
})
export class DatePickerModule {}
