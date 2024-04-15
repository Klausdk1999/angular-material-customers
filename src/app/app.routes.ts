import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { CreateContactComponent } from './create-contact/create-contact.component';
import { ContactDashboardComponent } from './contact-dashboard/contact-dashboard.component';

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
    path: 'customer',
    component: CreateCustomerComponent,
  },
  { path: 'customer/:id', component: CreateCustomerComponent },
  { path: 'customer/:customerId/contact', component: CreateContactComponent },
  {
    path: 'customer/:customerId/contact/:contactId',
    component: CreateContactComponent,
  },
  {
    path: 'customer/:customerId/contacts',
    component: ContactDashboardComponent,
  },
  {
    path: 'logout',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
