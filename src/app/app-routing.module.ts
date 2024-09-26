import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { UserNetworkTreeComponent } from './components/user-network-tree/user-network-tree.component';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { CompletePaymentComponent } from './pages/complete-payment/complete-payment.component';
import { PaymentTableComponent } from './components/payment-table/payment-table.component';
import { PaymentComponent } from './components/payment/payment.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'user-network', component: UserNetworkTreeComponent, canActivate: [AuthGuard] },
      { path: 'manage-account', component: ManageAccountComponent, canActivate: [AuthGuard] },
      { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
      { path: 'payment-details', component: PaymentTableComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Default route under LayoutComponent
    ]
  },
  { path: 'home', component: HomeComponent }, // Added explicit home route
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect to home for empty path
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'complete-payment', component: CompletePaymentComponent },
  { path: '**', redirectTo: 'home' } // Catch-all redirect to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
