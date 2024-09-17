import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../session.service';
import { SessionData } from '../model/session-data';
import { ViewSignalData } from '../model/view-mode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private httpClient = inject(HttpClient);
  private session = inject(SessionService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  username: string = '';
  email: string = '';
  password: string = '';

  errMsg = signal<string>('');

  login() {
    const sub = this.httpClient
      .get<{ uid: string }>('http://localhost:3000/user', {
        observe: 'response',
        headers: {
          username: this.username,
          email: this.email,
          password: this.password,
        },
      })
      .subscribe({
        next: (res) => {
          let newData: SessionData = {
            ...this.session.getData(),
            uid: res.body?.uid,
          };
          this.session.saveData(newData);
          this.errMsg.set('');
          this.router.navigateByUrl('');
        },
        error: (err) => {
          switch (err.status) {
            case 400:
              this.errMsg.set('Missing Data');
              break;
            case 401:
              this.errMsg.set('Invalid password');
              break;
            case 404:
              this.errMsg.set('User not found');
              break;
          }
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
