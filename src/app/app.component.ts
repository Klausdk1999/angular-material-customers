import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-material-customers';
  fb = inject(FormBuilder);
  createCustomerForm = this.fb.group({
    fullname: ['', Validators.required, Validators.minLength(3)],
    email: ['', Validators.required, Validators.email],
    phone: ['', Validators.required, Validators.minLength(10)],
  });

  onSubmit() {
    console.log(this.createCustomerForm.value);
  }
}
