import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  displayedColumns: string[] = ['fullname', 'email', 'phone', 'actions'];
  http = inject(HttpClient);
  platformId = inject(PLATFORM_ID);
  customers = [
    {
      id: 1,
      fullname: 'John Doe',
      email: 'a@b.com',
      phone: '11223344556677',
    },
    {
      id: 2,
      fullname: 'Jane Doe',
      email: '1@2.com.br',
      phone: '11223344556677',
    },
  ];
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
  onDelete(id: number) {
    if (id) {
      this.http.delete(`http://localhost:3000/customers/${id}`).subscribe({
        next: (response) => {
          console.log(response);
          this.customers = this.customers.filter(
            (customer) => customer.id !== id
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
}
