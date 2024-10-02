import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users-table/users-table.component';
import { UserNetworkTreeComponent } from './components/friends-tree/friends-tree.component';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { CompletePaymentComponent } from './pages/submit-payment-details/submit-payment-details.component';
import { PaymentTableComponent } from './components/payment-table/payment-table.component';
import { PaymentComponent } from './components/payment-details/payment-details.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersAccountTableComponent } from './components/users-account-table/users-account-table.component';
import { SettingComponent } from './components/setting/setting.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AboutComponent } from './pages/about/about.component';
import { ServiceComponent } from './pages/service/service.component';
import { TestimonialComponent } from './pages/testimonial/testimonial.component';
import { WorkComponent } from './pages/work/work.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MainComponent } from './pages/main/main.component';
import { MyFriendsComponent } from './components/my-friends/my-friends.component';
import { MoneyTransferComponent } from './components/money-transfer/money-transfer.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { AddMoneyComponent } from './components/add-money/add-money.component';
import { FriendsDetailsComponent } from './components/friends-details/friends-details.component';
import { FriendsTableComponent } from './components/friends-table/friends-table.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'user-details/:userId', component: UserDetailsComponent, canActivate: [AuthGuard] },
      { path: 'money-transfer', component: MoneyTransferComponent, canActivate: [AuthGuard] },
      { path: 'add-money', component: AddMoneyComponent, canActivate: [AuthGuard] },
      { path: 'friend-request', component: FriendRequestComponent, canActivate: [AuthGuard] },
      { path: 'my-friends', component: MyFriendsComponent, canActivate: [AuthGuard] },
      { path: 'friends-details', component: FriendsDetailsComponent, canActivate: [AuthGuard] },
      { path: 'friends-table', component: FriendsTableComponent, canActivate: [AuthGuard] },
      { path: 'friends-network/:userId', component: UserNetworkTreeComponent, canActivate: [AuthGuard] },
      { path: 'manage-account', component: ManageAccountComponent, canActivate: [AuthGuard] },
      { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
      { path: 'users-account', component: UsersAccountTableComponent, canActivate: [AuthGuard] },
      { path: 'payment', component: PaymentTableComponent, canActivate: [AuthGuard] },
      { path: 'payment-details/:userId', component: PaymentComponent, canActivate: [AuthGuard] },
      { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Default route under LayoutComponent
    ]
  },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServiceComponent },
      { path: 'testimonial', component: TestimonialComponent },
      { path: 'works', component: WorkComponent },
      { path: 'contact', component: ContactComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect to home for empty path
    ]
  },
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
