import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { HeroNameRes } from '../../model/hero-name-res';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../session.service';
import { map } from 'rxjs';
import { BarterComponent } from '../barter/barter.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [BarterComponent],
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.css',
})
export class ProposalComponent implements OnInit {
  missing = input.required<HeroNameRes[]>();
  owned = input.required<HeroNameRes[]>();

  newInSig = output<number>();
  newOutSig = output<number>();

  cancelSig = output<{ in: number[]; out: number[] }>();

  private firstIn!: boolean;
  private firstOut!: boolean;

  private router = inject(Router);

  in = signal<HeroNameRes[]>([
    {
      id: 0,
      name: 'Cards you will get',
      imageURL: 'empty-spot.jpg',
    },
  ]);
  out = signal<HeroNameRes[]>([
    {
      id: 0,
      name: 'Cards you will trade',
      imageURL: 'empty-spot.jpg',
    },
  ]);

  private httpClient = inject(HttpClient);
  private session = inject(SessionService);
  private destroyRef = inject(DestroyRef);

  uid = computed(() => this.session.getData()?.uid || '');

  ngOnInit(): void {
    this.firstIn = true;
    this.firstOut = true;
  }

  addToIn(hero: HeroNameRes) {
    if (this.firstIn) {
      this.in().pop();
      this.firstIn = false;
    }
    this.in().unshift(hero);
    this.newInSig.emit(hero.id);
  }

  addToOut(hero: HeroNameRes) {
    if (this.firstOut) {
      this.out().pop();
      this.firstOut = false;
    }
    this.out().unshift(hero);
    this.newOutSig.emit(hero.id);
  }

  cancelProposal() {
    this.cancelSig.emit({
      in: this.in().map((hero) => hero.id),
      out: this.out().map((hero) => hero.id),
    });
  }

  publishProposal() {
    const sub = this.httpClient
      .post<{ barterCode: string }>('http://localhost:3000/barters', {
        uid: this.session.getData()?.uid,
        in: this.in().map((h) => h.id),
        out: this.out().map((h) => h.id),
      })
      .pipe(map((res) => res.barterCode))
      .subscribe({
        next: (code) => {
          console.log(code);
          this.in.set([]);
          this.out.set([]);
          this.router.navigateByUrl('');
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
