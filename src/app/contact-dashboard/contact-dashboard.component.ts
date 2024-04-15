import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerDto } from '../dtos/customer.dto';
import { ContactDto } from '../dtos/contact.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './contact-dashboard.component.html',
  styleUrl: './contact-dashboard.component.scss',
})
export class ContactDashboardComponent {
  displayedColumns: string[] = [
    'fullname',
    'emails',
    'phones',
    'actions',
    'show',
    'new-contact',
  ];
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  customerId: string | null = null;

  contacts: ContactDto[] = [];

  getContacts = (customerId: string) => {
    this.http
      .get(`http://localhost:3000/customers/${customerId}/contacts`)
      .subscribe({
        next: (response: any) => {
          this.contacts = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe((params) => {
        this.customerId = params.get('customerId');
        if (this.customerId) {
          this.getContacts(this.customerId);
        }
      });
    }
  }

  onSelect(contactId: string) {
    this.router.navigate(['/customer', this.customerId, 'contact', contactId]);
  }

  onDelete(id: string) {
    if (id) {
      this.http
        .delete(
          `http://localhost:3000/customers/${this.customerId}/contacts/${id}`
        )
        .subscribe({
          next: (response) => {
            if (this.contacts.length) {
              this.contacts = this.contacts.filter(
                (customer) => customer.id !== id
              );
            }
            this.openSnackBar('Contato deletado', 'X');
          },
          error: (error) => {
            this.openSnackBar('Erro ao deletar contato', 'X');

            console.error(error);
          },
        });
    }
  }

  onCreateContact(id: string) {
    this.router.navigate(['/customer', id, 'contact']);
  }
}
