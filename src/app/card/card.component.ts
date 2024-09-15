import { Component, input } from '@angular/core';
import { HeroRes } from '../model/hero-res';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  hero = input.required<HeroRes | null>();

  navToHero(hero: HeroRes | null) {
    // route to app-hero
  }
}
