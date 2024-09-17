import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HeroNameRes } from '../../model/hero-name-res';
import { UserReq } from '../../model/user-req';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css',
})
export class UserSignupComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private session = inject(SessionService);

  options = signal<HeroNameRes[] | undefined>(undefined);

  username: string = '';
  email: string = '';
  password: string = '';
  hero: number = 0;

  ngOnInit(): void {
    const sub = this.httpClient
      .get<{ heroes: HeroNameRes[] }>('http://localhost:3000/heroes/names')
      .pipe(map((response) => response.heroes))
      .subscribe({
        next: (heroes) => {
          this.options.set(heroes);
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  signUp() {
    const user: UserReq = {
      name: this.username,
      email: this.email,
      password: this.password,
      favouriteSuper: this.hero,
    };

    const sub = this.httpClient
      .post<{ id: string }>('http://localhost:3000/user', user, {
        observe: 'response',
      })
      .subscribe({
        next: (res) => {
          if (res.ok) {
            let newData = { ...this.session.getData(), uid: res.body?.id };
            this.session.saveData(newData);
            this.router.navigateByUrl('');
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
