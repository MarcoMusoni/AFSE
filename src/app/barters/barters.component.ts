import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BarterComponent } from './barter/barter.component';
import { HeroNameRes } from '../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { SessionService } from '../session.service';
import { HeroRes } from '../model/hero-res';
import { ProposalComponent } from './proposal/proposal.component';

@Component({
  selector: 'app-barters',
  standalone: true,
  imports: [BarterComponent, ProposalComponent],
  templateUrl: './barters.component.html',
  styleUrl: './barters.component.css',
})
export class BartersComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private session = inject(SessionService);

  all = signal<HeroNameRes[]>([]);
  missing = signal<HeroNameRes[]>([]);
  owned = signal<HeroNameRes[]>([]);

  barters = signal<
    {
      in: HeroNameRes[];
      out: HeroNameRes[];
    }[]
  >([]);

  ngOnInit(): void {
    let bids: {
      in: number[];
      out: number[];
    }[] = [];

    let result: {
      in: HeroNameRes[];
      out: HeroNameRes[];
    }[] = [];

    const barters = this.httpClient
      .get<{ offers: { in: number[]; out: number[] }[] }>(
        'http://localhost:3000/barters/' + this.session.getData()?.uid
      )
      .pipe(map((res) => res.offers))
      .subscribe({
        next: (offers) => {
          offers.forEach((offer) =>
            bids.push({ in: offer.in, out: offer.out })
          );
        },
      });

    this.destroyRef.onDestroy(() => barters.unsubscribe);

    const names = this.httpClient
      .get<{ heroes: HeroNameRes[] }>('http://localhost:3000/heroes/names')
      .pipe(map((res) => res.heroes))
      .subscribe({
        next: (heroes) => {
          this.all.set(heroes);
          bids.forEach((bid) => {
            let newIn: HeroNameRes[] = [];
            let newOut: HeroNameRes[] = [];
            heroes.forEach((hero) => {
              if (bid.in.includes(hero.id)) newIn.push(hero);
              if (bid.out.includes(hero.id)) newOut.push(hero);
            });
            result.push({ in: newIn, out: newOut });
          });
        },
      });

    this.destroyRef.onDestroy(() => names.unsubscribe);

    this.barters.set(result);
  }

  newBarter() {
    const sub = this.httpClient
      .get<{ heroes: number[] }>(
        'http://localhost:3000/heroes/' + this.session.getData()?.uid
      )
      .pipe(map((res) => res.heroes))
      .subscribe({
        next: (heroes) => {
          this.all().forEach((hero) => {
            if (heroes.includes(hero.id)) {
              this.owned().push(hero);
            } else {
              this.missing().push(hero);
            }
          });
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe);
  }

  removedFromOwned(id: number) {
    let newOwned = this.owned().filter((hero) => hero.id !== id);
    this.owned.set(newOwned);
  }

  removeFromMissing(id: number) {
    let newMissing = this.missing().filter((hero) => hero.id !== id);
    this.missing.set(newMissing);
  }

  restoreLists(event: { in: number[]; out: number[] }) {
    this.all()
    .filter(hero => event.in.includes(hero.id))
    .forEach(hero => this.missing().push(hero));
    
    this.all()
    .filter(hero => event.out.includes(hero.id))
    .forEach(hero => this.owned().push(hero));
  }
}
