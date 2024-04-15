import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    HttpClientModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  httpClient = inject(HttpClient);
  router = inject(Router);

  loginForm = this.fb.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.httpClient
        .post<any>('http://localhost:3000/auth/login', this.loginForm.value)
        .subscribe({
          next: (response) => {
            localStorage.setItem('access_token', response.access_token);
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            if (error.status === 401) {
              alert(
                'Credenciais inválidas. Tente novamente.  "admin" e "admin" são as credenciais válidas.'
              );
            } else {
              console.error(error);
            }
          },
        });
    }
  }
}
