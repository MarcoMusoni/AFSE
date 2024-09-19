import { Injectable } from '@angular/core';
import { HeroRes } from '../model/hero-res';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private hero: HeroRes = {
    id: 0,
    duplicates: 0,
    name: '',
    description: '',
    imageURL: '',
    comics: [],
    events: [],
    series: [],
  };

  public getHero() : HeroRes {
    return this.hero;
  }

  public setHero(hero: HeroRes | null) {
    this.hero = hero || {
      id: 0,
      duplicates: 0,
      name: '',
      description: '',
      imageURL: '',
      comics: [],
      events: [],
      series: [],
    };
  }
}
