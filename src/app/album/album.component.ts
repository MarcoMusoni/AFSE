import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { GridComponent } from '../grid/grid.component';
import { HttpClient } from '@angular/common/http';
import { HeroRes } from '../model/hero-res';
import { Router, RouterLink } from '@angular/router';
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
  private router = inject(Router);

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
            if(heroes.length !== 0 && result[0].l === null) {
              result.pop();
              result.pop();
            }
            let l: HeroRes | null = null; 
            let r: HeroRes | null = null;
            for (let i = 0; i < heroes.length; i++) {
              if(i % 2 === 0) {
                l = heroes[i];
                if(i === heroes.length - 1) {
                  result.push({
                    l: l,
                    r: null
                  });
                } 
              } else {
                r = heroes[i];
                result.push({
                  l: l,
                  r: r
                });
              }
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
              packs: (this.session.getData()?.packs || 1) - 1,
            };
            this.packs = newSession.packs || 0;
            this.session.saveData(newSession);
            this.router.navigateByUrl('unpack');
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
