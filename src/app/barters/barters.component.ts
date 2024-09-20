import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BarterComponent } from './barter/barter.component';
import { HeroNameRes } from '../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { SessionService } from '../session.service';
import { ProposalComponent } from './proposal/proposal.component';
import { Router, RouterLink } from '@angular/router';
import { HeroRes } from '../model/hero-res';

@Component({
  selector: 'app-barters',
  standalone: true,
  imports: [BarterComponent, ProposalComponent, RouterLink],
  templateUrl: './barters.component.html',
  styleUrl: './barters.component.css',
})
export class BartersComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private session = inject(SessionService);
  private router = inject(Router);

  all = signal<HeroNameRes[]>([]);
  missing = signal<HeroNameRes[]>([]);
  owned = signal<HeroNameRes[]>([]);
  showNewOffer = signal<boolean>(false);

  private defaultEntries: {
    uid: string;
    id: string;
    in: HeroNameRes[];
    out: HeroNameRes[];
  } = {
    uid: 'abc',
    id: 'abc',
    in: [
      {
        id: 0,
        name: 'Cards you will get',
        imageURL: 'empty-spot.jpg',
      },
    ],
    out: [
      {
        id: 0,
        name: 'Cards you will trade',
        imageURL: 'empty-spot.jpg',
      },
    ],
  };

  barters = signal<
    {
      uid: string;
      id: string;
      in: HeroNameRes[];
      out: HeroNameRes[];
    }[]
  >([this.defaultEntries]);

  ngOnInit(): void {
    let bids: {
      uid: string;
      id: string;
      in: number[];
      out: number[];
    }[] = [];

    let result: {
      uid: string;
      id: string;
      in: HeroNameRes[];
      out: HeroNameRes[];
    }[] = [];

    const barters = this.httpClient
      .get<{
        offers: { uid: string; id: string; in: number[]; out: number[] }[];
      }>('http://localhost:3000/barters/' + this.session.getData()?.uid)
      .pipe(map((res) => res.offers))
      .subscribe({
        next: (offers) => {
          offers.forEach((offer) =>
            bids.push({
              uid: offer.uid,
              id: offer.id,
              in: offer.in,
              out: offer.out,
            })
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
            result.push({ uid: bid.uid, id: bid.id, in: newIn, out: newOut });
          });
          if (result.length === 0) result.push(this.defaultEntries);
          this.barters.set(result);
        },
      });

    this.destroyRef.onDestroy(() => names.unsubscribe);
  }

  newBarter() {
    const sub = this.httpClient
      .get<HeroRes[]>(
        'http://localhost:3000/heroes/' + this.session.getData()?.uid
      )
      .pipe(map((res) => res.map(hero => hero.id)))
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
    this.showNewOffer.set(true);
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
      .filter((hero) => event.in.includes(hero.id))
      .forEach((hero) => this.missing().push(hero));

    this.all()
      .filter((hero) => event.out.includes(hero.id))
      .forEach((hero) => this.owned().push(hero));

    this.showNewOffer.set(false);
  }

  removeAcceptedOffer(barterId: string) {
    let newList = this.barters().filter(
      (barter) => barterId !== barter.id || barter.id === ''
    );
    this.barters.set(newList);
    this.router.navigateByUrl('');
  }
}
