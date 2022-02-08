import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SetupLoginComponent } from './login/setup-login.component';
import { SetupLegalEntityComponent } from './legal-entity/setup-legal-entity.component';
import { SetupLocationComponent } from './location/setup-location.component';
import { SetupConfigComponent } from './config/setup-config.component';
import { SetupCompaniesComponent } from './companies/setup-companies.component';

@NgModule({
  declarations: [
    SetupComponent,
    SetupLoginComponent,
    SetupLegalEntityComponent,
    SetupLocationComponent,
    SetupConfigComponent,
    SetupCompaniesComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  exports: [SetupComponent],
})
export class SetupModule {}
