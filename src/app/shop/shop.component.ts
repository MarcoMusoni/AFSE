import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CreditComponent } from './credit/credit.component';
import { HttpClient } from '@angular/common/http';
import { CreditPacksRes } from '../model/credit-packs-res';
import { SessionService } from '../session.service';
import { SessionData } from '../model/session-data';
import { PackComponent } from './pack/pack.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CreditComponent, PackComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {

  class5 = signal<string>('default');
  class10 = signal<string>('default');
  class20 = signal<string>('default');

  private amount: number = 0;
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private session = inject(SessionService);

  buyCredits() {
    const sub = this.httpClient.post<CreditPacksRes>('http://localhost:3000/credit', {
      id: this.session.getData()?.uid,
      credits: this.amount
    })
    .subscribe({
      next: (res) => {
        let newData : SessionData = { ...this.session.getData(), credits: res.newCreditAmount};
        this.session.saveData(newData);
      }
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.class5.set('default');
    this.class10.set('default');
    this.class20.set('default');
  }

  onAmountSelected(amountSelected: number) {
    this.amount = amountSelected;
    switch (amountSelected) {
      case 5:
        this.class5.set('selected');
        this.class10.set('default');
        this.class20.set('default');
        break;
      case 10:
        this.class10.set('selected');
        this.class5.set('default');
        this.class20.set('default');
        break;
      case 20:
        this.class20.set('selected');
        this.class10.set('default');
        this.class5.set('default');
        break;
      default:
        this.class5.set('default');
        this.class10.set('default');
        this.class20.set('default');
    }
  }
}
