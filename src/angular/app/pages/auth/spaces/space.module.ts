import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TablesComponent } from './components/table/tables.component';
import { SpaceComponent } from './containers/space/space.component';
import { AuthorizedLayoutModule } from '../../../layouts/authorized-layout/authorized-layout.module';
import { FocusOutModule } from '../../../core/directives/focus-out.directive';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './../../../../assets/i18n/', '.json');
}

@NgModule({
  declarations: [SpaceComponent, TablesComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    FocusOutModule,
    ReactiveFormsModule,
    AuthorizedLayoutModule,
  ],
  exports: [SpaceComponent],
})
export class SpaceModule {}
