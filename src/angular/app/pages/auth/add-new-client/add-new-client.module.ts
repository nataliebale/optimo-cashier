import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AddNewClientComponent } from './add-new-client.component';
import { AuthorizedLayoutModule } from '../../../layouts/authorized-layout/authorized-layout.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IconModule } from '../../../shared-components/icon/icon.module';
import { NgxMaskModule } from 'ngx-mask';
import { LegalEntityProductsComponent } from '../legal-entity/products/legal-entity-products.component';
import { LegalEntityModule } from '../legal-entity/legal-entity.module';

@NgModule({
  declarations: [AddNewClientComponent],
  imports: [
    CommonModule,
    AuthorizedLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    IconModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    LegalEntityModule,
  ],
  exports: [AddNewClientComponent],
})
export class AddNewClientModule {}
