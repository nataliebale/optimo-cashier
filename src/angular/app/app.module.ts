import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeKa from '@angular/common/locales/ka';
import { registerLocaleData } from '@angular/common';
import { LoginModule } from './pages/login/login.module';
import { DashboardModule } from './pages/auth/dashboard/dashboard.module';
import { PaymentModule } from './pages/auth/payment/payment.module';
import { OrdersModule } from './pages/auth/orders/orders.module';
import { HomeModule } from './pages/auth/home/home.module';
import { SetupModule } from './pages/setup/setup.module';
import { LegalEntityModule } from './pages/auth/legal-entity/legal-entity.module';
import { AddNewClientModule } from './pages/auth/add-new-client/add-new-client.module';
import { MatDialogModule } from '@angular/material/dialog';
import { reducers } from './state';
import { AppConfig } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SpaceModule } from './pages/auth/spaces/space.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CecksEffects } from './state/check/check.effects';
import { SpaceEffects } from './state/space/space.effects';
import { IconModule } from './shared-components/icon/icon.module';
import { OrderHistoryModule } from './pages/auth/order-history/order-history.module';
registerLocaleData(localeKa);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const FEATURE_MODULES = [
  LoginModule,
  DashboardModule,
  PaymentModule,
  OrdersModule,
  HomeModule,
  SetupModule,
  LegalEntityModule,
  AddNewClientModule,
  SpaceModule,
  OrderHistoryModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([CecksEffects, SpaceEffects]),
    AppConfig.production
      ? []
      : StoreDevtoolsModule.instrument({
          maxAge: 25,
          logOnly: AppConfig.production,
        }),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatDialogModule,
    IconModule,
    ...FEATURE_MODULES,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ka' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
