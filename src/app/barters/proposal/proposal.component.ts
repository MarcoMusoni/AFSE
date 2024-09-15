import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { HeroNameRes } from '../../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../session.service';
import { map } from 'rxjs';
import { BarterComponent } from "../barter/barter.component";

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [BarterComponent],
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.css',
})
export class ProposalComponent {
  missing = input.required<HeroNameRes[]>();
  owned = input.required<HeroNameRes[]>();

  newInSig = output<number>();
  newOutSig = output<number>();

  cancelSig = output<{ in: number[]; out: number[] }>();

  in = signal<HeroNameRes[]>([]);
  out = signal<HeroNameRes[]>([]);

  private httpClient = inject(HttpClient);
  private session = inject(SessionService);
  private destroyRef = inject(DestroyRef);

  addToIn(hero: HeroNameRes) {
    this.in().push(hero);
    this.newInSig.emit(hero.id);
  }

  addToOut(hero: HeroNameRes) {
    this.out().push(hero);
    this.newOutSig.emit(hero.id);
  }

  cancelProposal() {
    this.cancelSig.emit({ in: this.in().map(hero => hero.id), out: this.out().map(hero => hero.id) });
  }

  publishProposal() {
    const sub = this.httpClient
      .post<{ barterCode: string }>('http://localhost:3000/barters', {
        uid: this.session.getData()?.uid,
        in: this.in,
        out: this.out,
      })
      .pipe(map((res) => res.barterCode))
      .subscribe({
        next: (code) => {
          console.log(code);
          this.in.set([]);
          this.out.set([]);
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
