import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { LegalEntityComponent } from './legal-entity.component';
import { AuthorizedLayoutModule } from '../../../layouts/authorized-layout/authorized-layout.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LegalEntityProductsComponent } from './products/legal-entity-products.component';
import { IconModule } from '../../../shared-components/icon/icon.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [LegalEntityComponent, LegalEntityProductsComponent],
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
  ],
  exports: [LegalEntityComponent, LegalEntityProductsComponent],
})
export class LegalEntityModule {}
