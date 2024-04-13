import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-material-customers';
  fb = inject(FormBuilder);
  createCustomerForm = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit() {
    console.log(this.createCustomerForm.value);
    this.createCustomerForm.reset();
  }

  displayedColumns: string[] = ['id', 'fullname', 'email', 'phone', 'actions'];
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

  onDelete(id: number) {
    this.customers = this.customers.filter((customer) => customer.id !== id);
  }
}
