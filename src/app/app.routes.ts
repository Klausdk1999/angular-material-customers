import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';

// there is /login and /dashboard
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'customers',
    component: DashboardComponent,
  },
  {
    path: 'new-customer',
    component: CreateCustomerComponent,
  },
  { path: 'edit-customer/:id', component: CreateCustomerComponent },
  {
    path: '**',
    redirectTo: 'login',
  },
];
