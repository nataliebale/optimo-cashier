import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/auth/dashboard/dashboard.component';
import { PaymentComponent } from './pages/auth/payment/payment.component';
import { OrdersComponent } from './pages/auth/orders/orders.component';
import { HomeComponent } from './pages/auth/home/home.component';
import { SetupComponent } from './pages/setup/setup.component';
import { LegalEntityComponent } from './pages/auth/legal-entity/legal-entity.component';
import { OdinInitedGuard } from './core/guards/odin-inited.guard';
import { LegalEntityGuard } from './core/guards/legal-entity.guard';
import { SpaceComponent } from './pages/auth/spaces/containers/space/space.component';
import { SpaceGuard } from './core/guards/space.guard';
import { OrderHistoryComponent } from './pages/auth/order-history/containers/order-history/order-history.component';
import { AddNewClientComponent } from './pages/auth/add-new-client/add-new-client.component';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [OdinInitedGuard],
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: 'space',
    canActivate: [SpaceGuard],
    component: SpaceComponent,
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
  },
  {
    path: 'legal-entity',
    canActivate: [LegalEntityGuard],
    component: LegalEntityComponent,
  },
  {
    path: 'legal-entity-old',
    // canActivate: [AddNewClientComponent],
    component: AddNewClientComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
