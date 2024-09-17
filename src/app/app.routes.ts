import { Routes } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { BartersComponent } from './barters/barters.component';
import { HeroComponent } from './hero/hero.component';
import { LoginComponent } from './login/login.component';
import { ShopComponent } from './shop/shop.component';
import { UserSignupComponent } from './user/user-signup/user-signup.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  {
    path: '',
    component: AlbumComponent,
  },
  {
    path: 'barters',
    component: BartersComponent,
  },
  {
    path: 'hero',
    component: HeroComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'shop',
    component: ShopComponent,
  },
  {
    path: 'user/signup',
    component: UserSignupComponent,
  },
  {
    path: 'user/edit',
    component: UserEditComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent
  }
];
