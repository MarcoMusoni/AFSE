import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../grid/card/card.component';
import { HeroRes } from '../model/hero-res';
import { DetailsComponent } from './details/details.component';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../session.service';
import { CreditCardsRes } from '../model/credit-cards-res';
import { SessionData } from '../model/session-data';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CardComponent, DetailsComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit{

  private httpClient = inject(HttpClient);
  private session = inject(SessionService);
  private destroyRef = inject(DestroyRef);

  hero = signal<HeroRes>({
    id: 0,
    duplicates: 0,
    name: '',
    description: '',
    imageURL: '',
    comics: [],
    events: [],
    series: [],
  });

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  sellCard() {
    const sub = this.httpClient.post<CreditCardsRes>('http://localhost:3000/credit/card', {
      uid: this.session.getData()?.uid,
      id: this.hero().id
    })
    .subscribe({
      next: (res) => {
        let newData: SessionData = { ...this.session.getData(), credits: res.newCreditAmount }
        this.session.saveData(newData);
        let newHeroRes: HeroRes = { ...this.hero(), duplicates: res.newCardAmount }
        this.hero.set(newHeroRes);
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
