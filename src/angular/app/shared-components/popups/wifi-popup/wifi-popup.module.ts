import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WifiPopupComponent } from './wifi-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WifiPasswordPopupComponent } from './password/wifi-password-popup.component';

@NgModule({
  declarations: [WifiPopupComponent, WifiPasswordPopupComponent],
  entryComponents: [WifiPopupComponent, WifiPasswordPopupComponent],
  exports: [WifiPopupComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
})
export class WifiPopupModule {}
