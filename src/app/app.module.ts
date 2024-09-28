import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { UsersComponent } from './components/users-table/users-table.component';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserNetworkTreeComponent } from './components/user-network-tree/user-network-tree.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { CompletePaymentComponent } from './pages/submit-payment-details/submit-payment-details.component';
import { MatOptionModule } from '@angular/material/core';
import { PaymentTableComponent } from './components/payment-table/payment-table.component';
import { PaymentComponent } from './components/payment-details/payment-details.component'; // Import MatOptionModule explicitly
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  // Import MatProgressSpinnerModule
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './pages/home/home.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { SettingComponent } from './components/setting/setting.component';
import { UsersAccountTableComponent } from './components/users-account-table/users-account-table.component';
import { MatSelectModule } from '@angular/material/select';
import { AuthInterceptor } from './auth.interceptor';
import { DialogComponent } from './pages/dialog/dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    DashboardComponent,
    UsersComponent,
    ManageAccountComponent,
    UserNetworkTreeComponent,
    CompletePaymentComponent,
    PaymentTableComponent,
    PaymentComponent,
    HomeComponent,
    UserDetailsComponent,
    SettingComponent,
    UsersAccountTableComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTreeModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatGridListModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,  // Optional: Toast display time in milliseconds
      positionClass: 'toast-bottom-right',  // Optional: Toast position
      preventDuplicates: true,  // Prevent multiple duplicate toasts
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
