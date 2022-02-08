import { CheckDropdownMoreComponent } from './check/dropdown-more/check-dropdown-more.component';
import { IconModule } from './../../../shared-components/icon/icon.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DashboardComponent } from './dashboard.component';
import { AuthorizedLayoutModule } from '../../../layouts/authorized-layout/authorized-layout.module';
import { AssortimentsDialogModule } from '../../../shared-components/popups/assortiments-dialog/assortiments-dialog.module';
import { MessagePopupModule } from './../../../shared-components/popups/message-popup/message-popup.module';
import { CheckComponent } from './check/check.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgLetModule } from '../../../core/directives/ngLet.directive';
import { NumpadModule } from '../../../shared-components/numpad/numpad.module';
import { ProductsBarComponent } from './products-bar/products-bar.component';
import { ProductsBarSearchComponent } from './products-bar/search/products-bar-search.component';
import { ProductsBarTabsComponent } from './products-bar/tabs/products-bar-tabs.component';
import { DialogPopupModule } from '../../../shared-components/popups/dialog-popup/dialog-popup.module';
import { SyncLoadingPopupModule } from '../../../shared-components/popups/sync-loading-popup/sync-loading-popup.module';
import { ProductsBarContentComponent } from './products-bar/content/products-bar-content.component';
import { ProductsBarContentListComponent } from './products-bar/content/list/products-bar-content-list.component';
import { BasketComponent } from './basket/basket.component';
import { InputDialogModule } from '../../../shared-components/popups/input-dialog/input-dialog.module';
import { DashboardNumpadComponent } from './numpad/dashboard-numpad.component';
import { FocusOutModule } from '../../../core/directives/focus-out.directive';
import { GuestsDetailsModule } from '../../../shared-components/popups/guests-details/guests-details.module';
import { ProductsBarContentCategoriesComponent } from './products-bar/content/categories/products-bar-content-categories.component';
import { ProductsBarContentSuppliersComponent } from './products-bar/content/suppliers/products-bar-content-suppliers.component';
import { ChangeTableComponent } from './change-table/change-table.component';
import { ChangeOperatorModule } from '../../../shared-components/popups/change-operator/change-operator.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './../../../../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DashboardComponent,
    BasketComponent,
    CheckComponent,
    ProductsBarComponent,
    ProductsBarSearchComponent,
    ProductsBarTabsComponent,
    ProductsBarContentComponent,
    ProductsBarContentListComponent,
    ProductsBarContentCategoriesComponent,
    ProductsBarContentSuppliersComponent,
    DashboardNumpadComponent,
    CheckDropdownMoreComponent,
    ChangeTableComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AuthorizedLayoutModule,
    ReactiveFormsModule,
    MatDialogModule,
    AssortimentsDialogModule,
    MessagePopupModule,
    SyncLoadingPopupModule,
    DialogPopupModule,
    NgLetModule,
    FormsModule,
    NumpadModule,
    FocusOutModule,
    InputDialogModule,
    IconModule,
    GuestsDetailsModule,
    AuthorizedLayoutModule,
    ChangeOperatorModule,
  ],
})
export class DashboardModule {}
