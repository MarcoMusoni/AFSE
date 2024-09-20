import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { HeroNameRes } from '../../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../session.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-barter',
  standalone: true,
  imports: [RouterLink],
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

  private router = inject(Router);

  acceptOffer() {
    const sub = this.httpClient
      .put(
        'http://localhost:3000/cards',
        {
          bid: this.barter().id,
          uidIn: this.session.getData()?.uid,
          uidOut: this.barter().uid,
          offer: {
            in: this.barter().in.map((e) => e.id),
            out: this.barter().out.map((e) => e.id),
          },
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
