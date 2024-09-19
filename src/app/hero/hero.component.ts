import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { CardComponent } from '../grid/card/card.component';
import { HeroRes } from '../model/hero-res';
import { DetailsComponent } from './details/details.component';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../session.service';
import { CreditCardsRes } from '../model/credit-cards-res';
import { SessionData } from '../model/session-data';
import { RouterLink } from '@angular/router';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CardComponent, DetailsComponent, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private session = inject(SessionService);
  private destroyRef = inject(DestroyRef);
  private heroSrv = inject(HeroService);

  hero = computed(() => this.heroSrv.getHero());
  amount!: number;

  ngOnInit(): void {
    this.amount = this.hero().duplicates;
  }

  sellCard() {
    const sub = this.httpClient
      .post<CreditCardsRes>('http://localhost:3000/credit/card', {
        uid: this.session.getData()?.uid,
        id: this.hero().id,
      })
      .subscribe({
        next: (res) => {
          let newData: SessionData = {
            ...this.session.getData(),
            credits: res.newCreditAmount,
          };
          this.session.saveData(newData);
          let newHeroRes: HeroRes = {
            ...this.hero(),
            duplicates: res.newCardAmount,
          };
          this.heroSrv.setHero(newHeroRes);
          this.amount = this.amount - 1;
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
