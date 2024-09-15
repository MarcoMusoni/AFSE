import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SessionService } from '../session.service';
import { OperationType } from '../model/operation-type';
import { GridComponent } from '../grid/grid.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { HeroRes } from '../model/hero-res';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [GridComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css',
})
export class AlbumComponent implements OnInit {
  
  private session = inject(SessionService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  public isAuth = signal<boolean>(false);

  packNumber = signal<number>(0);

  cards = signal<
    {
      l: HeroRes | null;
      r: HeroRes | null;
    }[]
  >([
    { l: null, r: null },
    { l: null, r: null },
  ]);

  private getCards() {
    const sub = this.httpClient
      .get<{ heroes: HeroRes[] }>(
        'localhost:3000/heroes/' + this.session.getData()?.uid
      )
      .pipe(map((response) => response.heroes))
      .subscribe({
        next: (heroes) => {
          let result: {
            l: HeroRes | null;
            r: HeroRes | null;
          }[] = [];

          for (let i = 0; i < heroes.length / 2; i++) {
            result.push({
              l: heroes[i * 2],
              r: heroes[i * 2 + 1].id !== 0 ? heroes[i * 2 + 1] : null,
            });
          }

          this.cards.set(result);
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.isAuth.set(this.session.isAuth());
    if (this.isAuth()) {
      this.getCards();
      const sub = this.httpClient
        .get<{ packs: number }>(
          'http://localhost:3000/packs/' + this.session.getData()?.uid
        )
        .pipe(map((res) => res.packs))
        .subscribe({
          next: (pack) => {
            this.packNumber.set(pack);
          },
        });

      this.destroyRef.onDestroy(() => {
        sub.unsubscribe();
      });
    }
  }

  navToUser(op: OperationType) {
    // route to app-user with provided op type
  }

  navToLogin() {
    // route to app-login
  }

  navToShop() {
    throw new Error('Method not implemented.');
  }

  navToTrade() {
    throw new Error('Method not implemented.');
  }

  logout() {
    this.session.logout();
    this.isAuth.set(false);
  }

  openPacks() {
    const sub = this.httpClient
      .post<{ success: boolean }>('http://localhost:3000/cards', {
        uid: this.session.getData()?.uid,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.getCards();
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
