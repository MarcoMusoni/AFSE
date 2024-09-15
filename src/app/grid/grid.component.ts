import { Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { HeroRes } from '../model/hero-res';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent {
  cards = input.required<{
    l: HeroRes | null;
    r: HeroRes | null;
  }[]>();
}
