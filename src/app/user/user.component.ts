import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { HeroNameRes } from '../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserReq } from '../model/user-req';
import { UserDeleteComponent } from './user-delete/user-delete.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, UserDeleteComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  isSignIn = input.required<boolean>();

  options = signal<HeroNameRes[] | undefined>(undefined);
  deleteView = signal<boolean>(false);

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

  signIn() {
    const user: UserReq = {
      name: this.username,
      email: this.email,
      password: this.password,
      favouriteSuper: this.hero,
    };

    const sub = this.httpClient
      .post('http://localhost:3000/user', user)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
  
  editUser() {
    const user: UserReq = {
      name: this.username,
      email: this.email,
      password: this.password,
      favouriteSuper: this.hero,
    };

    const sub = this.httpClient
      .put('http://localhost:3000/user', user)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  showDelete() {
    this.deleteView.set(true);
  }
  
  hideDelete() {
    this.deleteView.set(false);
  }
}
