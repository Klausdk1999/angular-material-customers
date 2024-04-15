import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomerDto } from '../dtos/customer.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss',
})
export class CreateCustomerComponent {
  title = 'angular-material-customers';
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  createCustomerForm = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    emails: this.fb.array([this.createEmailControl()]),
    phones: this.fb.array([this.createPhoneControl()]),
    registerDate: [new Date(), [Validators.required]],
  });
  createEmailControl(): FormControl {
    return this.fb.control('', [Validators.required, Validators.email]);
  }

  createPhoneControl(): FormControl {
    return this.fb.control('', [Validators.required, Validators.minLength(10)]);
  }

  addEmail() {
    this.emails.push(this.createEmailControl());
  }

  addPhone() {
    this.phones.push(this.createPhoneControl());
  }

  get emails(): FormArray {
    return this.createCustomerForm.get('emails') as FormArray;
  }

  get phones(): FormArray {
    return this.createCustomerForm.get('phones') as FormArray;
  }

  onSubmit() {
    if (this.createCustomerForm.valid) {
      this.http
        .post<CustomerDto>(
          'http://localhost:3000/customers',
          this.createCustomerForm.value
        )
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
    this.createCustomerForm.reset();
  }
}
