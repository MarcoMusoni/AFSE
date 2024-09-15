import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HeroNameRes } from '../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserReq } from '../model/user-req';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { OperationType } from '../model/operation-type';

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

  options = signal<HeroNameRes[] | undefined>(undefined);
  operation = signal<OperationType>('CREATE_USER');
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

  submitUserForm() {
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

  showDelete() {
    this.operation.set('DELETE_USER');
  }

  hideDelete() {
  }
}
