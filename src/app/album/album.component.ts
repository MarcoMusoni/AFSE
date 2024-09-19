import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { SessionService } from '../session.service';
import { GridComponent } from '../grid/grid.component';
import { HttpClient } from '@angular/common/http';
import { HeroRes } from '../model/hero-res';
import { RouterLink } from '@angular/router';
import { SessionData } from '../model/session-data';

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

  packs!: number;
  
  public credits = computed(() => this.session.getData()?.credits);
  public cards = computed(() => this.getCards());

  getCards() {
    let result: {
      l: HeroRes | null;
      r: HeroRes | null;
    }[] = [
      {
        l: null,
        r: null,
      },
      {
        l: null,
        r: null,
      },
    ];

    if (this.session.isAuth()) {
      const sub = this.httpClient
        .get<HeroRes[]>(
          'http://localhost:3000/heroes/' + this.session.getData()?.uid
        )
        .subscribe({
          next: (heroes) => {
            for (let i = 0; i < heroes.length / 2; i++) {
              result.unshift({
                l: heroes[i * 2],
                r: heroes[i * 2 + 1].id !== 0 ? heroes[i * 2 + 1] : null,
              });
            }
          },
        });

      this.destroyRef.onDestroy(() => {
        sub.unsubscribe();
      });
    }

    return result;
  }

  ngOnInit(): void {
    this.getCards();
    this.packs = this.session.isAuth() ? this.session.getData()?.packs || 0 : 0;
  }

  openPacks() {
    const sub = this.httpClient
      .post<{ success: boolean }>('http://localhost:3000/cards', {
        uid: this.session.getData()?.uid,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            let newSession: SessionData = {
              ...this.session.getData(),
              packs: this.session.getData()?.packs || 1 - 1,
            };
            this.packs = newSession.packs || 0;
            this.session.saveData(newSession);
            this.getCards();
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
