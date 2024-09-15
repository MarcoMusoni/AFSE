import { Component, input } from '@angular/core';
import { HeroNameRes } from '../../model/hero-name-res';

@Component({
  selector: 'app-barter',
  standalone: true,
  imports: [],
  templateUrl: './barter.component.html',
  styleUrl: './barter.component.css',
})
export class BarterComponent {
  barter = input.required<{in: HeroNameRes[], out: HeroNameRes[]}>();
}
