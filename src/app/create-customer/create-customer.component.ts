import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
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
  router = inject(Router);
  route = inject(ActivatedRoute);
  platformId = inject(PLATFORM_ID);

  createCustomerForm = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    emails: this.fb.array([this.createEmailControl()]),
    phones: this.fb.array([this.createPhoneControl()]),
    registerDate: [new Date(), [Validators.required]],
  });

  customerId: string | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe((params) => {
        this.customerId = params.get('id');
        if (this.customerId) {
          this.loadCustomer(this.customerId);
        } else {
          this.addEmail();
          this.addPhone();
        }
      });
    }
  }

  loadCustomer(id: string) {
    this.http
      .get<CustomerDto>(`http://localhost:3000/customers/${id}`)
      .subscribe({
        next: (customer) => {
          this.createCustomerForm.patchValue({
            fullname: customer.fullname,
            registerDate: customer.registerDate,
          });
          this.setFormArrays('emails', customer.emails);
          this.setFormArrays('phones', customer.phones);
        },
        error: (error) => console.error('Could not load customer', error),
      });
  }

  setFormArrays(field: string, data: any[]) {
    const array = this.createCustomerForm.get(field) as FormArray;
    array.clear();
    data.forEach((value) =>
      array.push(this.fb.control(value, [Validators.required]))
    );
  }

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
      if (this.customerId) {
        this.http
          .put<CustomerDto>(
            `http://localhost:3000/customers/${this.customerId}`,
            this.createCustomerForm.value
          )
          .subscribe({
            next: (response) => {
              console.log(response);
              this.router.navigate(['/customers']);
            },
            error: (error) => {
              console.error(error);
            },
          });
      } else {
        this.http
          .post<CustomerDto>(
            'http://localhost:3000/customers',
            this.createCustomerForm.value
          )
          .subscribe({
            next: (response) => {
              console.log(response);
              this.router.navigate(['/customers']);
            },
            error: (error) => {
              console.error(error);
            },
          });
      }
    }
    this.createCustomerForm.reset();
  }
}
