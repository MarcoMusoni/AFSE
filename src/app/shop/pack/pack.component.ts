import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { SessionService } from '../../session.service';
import { CreditPacksRes } from '../../model/credit-packs-res';
import { SessionData } from '../../model/session-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pack',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pack.component.html',
  styleUrl: './pack.component.css',
})
export class PackComponent {

  private httpClient = inject(HttpClient);
  private session = inject(SessionService);
  private destroyRef = inject(DestroyRef);
  
  amount = signal<number>(0);
  
  buyPacks() {
    const sub = this.httpClient.post<CreditPacksRes>('http://localhost:3000/credit', {
      id: this.session.getData()?.uid,
      credits: -5 * this.amount(),
      packs: this.amount()
    })
    .subscribe({
      next: (res) => {
        let newData : SessionData = { ...this.session.getData(), credits: res.newCreditAmount, packs: res.newPacksAmount }
        this.session.saveData(newData);
        this.amount.set(0);
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }


  newAmount(op: number) {
    let newAmount = this.amount() + op < 0 ? 0 : this.amount() + op;
    this.amount.set(newAmount);
  }
}
