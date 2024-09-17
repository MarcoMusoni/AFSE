import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SessionService } from '../session.service';
import { GridComponent } from '../grid/grid.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { HeroRes } from '../model/hero-res';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [GridComponent, RouterLink],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css',
})
export class AlbumComponent implements OnInit {
  
  private session = inject(SessionService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  public isAuth = computed(() => {
    return this.session.isAuth();
  });

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
