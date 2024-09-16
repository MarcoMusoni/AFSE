import { Component, inject, OnInit, signal } from '@angular/core';
import { SessionService } from './session.service';
import { AlbumComponent } from './album/album.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BartersComponent } from './barters/barters.component';
import { HeroComponent } from './hero/hero.component';
import { ShopComponent } from './shop/shop.component';
import { UserComponent } from './user/user.component';
import { ViewSignalData } from './model/view-mode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AlbumComponent,
    LoginComponent,
    SignupComponent,
    BartersComponent,
    HeroComponent,
    ShopComponent,
    UserComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  
  private session = inject(SessionService);

  view = signal<ViewSignalData>({mode: 'ALBUM'});

  ngOnInit(): void {
    this.session.initSessionData();
  }

  changeView(sig: ViewSignalData) {
    this.view.set(sig);
  }
}
