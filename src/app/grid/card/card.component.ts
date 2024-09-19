import { Component, inject, input } from '@angular/core';
import { HeroRes } from '../../model/hero-res';
import { Router } from '@angular/router';
import { HeroService } from '../../hero/hero.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {

  private router = inject(Router);
  private heroSrv = inject(HeroService);

  hero = input.required<HeroRes | null>();

  navToHero(hero: HeroRes | null) {
    this.heroSrv.setHero(hero);
    this.router.navigateByUrl('hero');
  }
}
