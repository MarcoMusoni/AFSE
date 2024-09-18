import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { HeroNameRes } from '../../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-barter',
  standalone: true,
  imports: [],
  templateUrl: './barter.component.html',
  styleUrl: './barter.component.css',
})
export class BarterComponent {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private session = inject(SessionService);

  barter = input.required<{
    uid: string;
    id: string;
    in: HeroNameRes[];
    out: HeroNameRes[];
  }>();

  acceptEnabled = input.required<boolean>();

  acceptedSig = output<string>();

  acceptOffer() {
    const sub = this.httpClient
      .put(
        'http://locahost:3000/cards/' + this.barter().id,
        {
          bid: this.barter().id,
          uidIn: this.session.getData()?.uid,
          uidOut: this.barter().uid,
          in: this.barter().in,
          out: this.barter().out,
        },
        { observe: 'response' }
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.acceptedSig.emit(this.barter().id);
          }
        },
      });
    
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
