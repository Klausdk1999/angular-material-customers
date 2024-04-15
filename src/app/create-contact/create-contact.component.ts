import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactDto } from '../dtos/contact.dto';
import { CustomerDto } from '../dtos/customer.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-contact',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
    CdkAccordionModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-contact.component.html',
  styleUrl: './create-contact.component.scss',
})
export class CreateContactComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  platformId = inject(PLATFORM_ID);

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  createContactForm = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    emails: this.fb.array([this.createEmailControl()]),
    phones: this.fb.array([this.createPhoneControl()]),
  });

  customerId: string | null = null;
  contactId: string | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe((params) => {
        this.customerId = params.get('customerId');
        this.contactId = params.get('contactId');
        if (this.customerId && this.contactId) {
          this.loadContact(this.customerId, this.contactId);
        } else {
          this.addEmail();
          this.addPhone();
        }
      });
    }
  }

  loadContact(customerId: string, contactId: string) {
    this.http
      .get<ContactDto>(
        `http://localhost:3000/customers/${customerId}/contacts/${contactId}`
      )
      .subscribe({
        next: (customer) => {
          this.createContactForm.patchValue({
            fullname: customer.fullname,
          });
          this.setFormArrays('emails', customer.emails);
          this.setFormArrays('phones', customer.phones);
        },
        error: (error) => console.error('Could not load customer', error),
      });
  }

  setFormArrays(field: string, data: any[]) {
    const array = this.createContactForm.get(field) as FormArray;
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
    return this.createContactForm.get('emails') as FormArray;
  }

  get phones(): FormArray {
    return this.createContactForm.get('phones') as FormArray;
  }

  onSubmit() {
    if (this.createContactForm.valid) {
      if (this.customerId && this.contactId) {
        this.http
          .put<CustomerDto>(
            `http://localhost:3000/customers/${this.customerId}/contacts/${this.contactId}`,
            this.createContactForm.value
          )
          .subscribe({
            next: (response) => {
              console.log(response);
              this.openSnackBar('Contato atualizado com sucesso', 'X');
              this.router.navigate(['/customers']);
            },
            error: (error) => {
              this.openSnackBar('Erro ao atualizar contato', 'X');
              console.error(error);
            },
          });
      } else {
        this.http
          .post<CustomerDto>(
            `http://localhost:3000/customers/${this.customerId}/contacts`,
            this.createContactForm.value
          )
          .subscribe({
            next: (response) => {
              console.log(response);
              this.openSnackBar('Contato criado com sucesso', 'X');
              this.router.navigate(['/customers']);
            },
            error: (error) => {
              console.error(error);
              this.openSnackBar('Erro ao criar contato', 'X');
            },
          });
      }
    }
    this.createContactForm.reset();
  }
}
