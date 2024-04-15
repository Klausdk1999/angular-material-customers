import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomerDto } from '../dtos/customer.dto';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  displayedColumns: string[] = [
    'fullname',
    'emails',
    'phones',
    'contacts',
    'actions',
    'show',
    'new-contact',
    'view-contacts',
  ];
  http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  customers: CustomerDto[] = [];

  getCustomers = () => {
    this.http.get('http://localhost:3000/customers').subscribe({
      next: (response: any) => {
        console.log(response);
        this.customers = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getCustomers();
    }
  }

  onSelect(id: string) {
    this.router.navigate(['/customer', id]);
  }

  onDelete(id: string) {
    if (id) {
      this.http.delete(`http://localhost:3000/customers/${id}`).subscribe({
        next: (response) => {
          if (this.customers.length) {
            this.customers = this.customers.filter(
              (customer) => customer.id !== id
            );
          }
          this.openSnackBar('Cliente removido com sucesso', 'X');
        },
        error: (error) => {
          this.openSnackBar('Erro ao remover cliente', 'X');
          console.error(error);
        },
      });
    }
  }

  onCreateContact(id: string) {
    this.router.navigate(['/customer', id, 'contact']);
  }

  onViewContacts(id: string) {
    this.router.navigate(['/customer', id, 'contacts']);
  }
}
