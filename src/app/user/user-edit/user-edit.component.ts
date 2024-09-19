import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { HttpClient } from '@angular/common/http';
import { HeroNameRes } from '../../model/hero-name-res';
import { map } from 'rxjs';
import { UserReq } from '../../model/user-req';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [UserDeleteComponent, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

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

  editUser() {
    const user: UserReq = {
      username: this.username,
      email: this.email,
      password: this.password,
      favouriteSuper: this.hero,
    };

    const sub = this.httpClient
      .put('http://localhost:3000/user', user, { observe: 'response' })
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.router.navigateByUrl('');
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  showDelete() {
    this.deleteView.set(true);
  }

  hideDelete(deleted: boolean) {
    this.deleteView.set(false);
    if (deleted) {
      this.router.navigateByUrl('logout');
    }
  }
}
