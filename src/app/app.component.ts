import { Component, inject, OnInit } from '@angular/core';
import { SessionService } from './session.service';
import { AlbumComponent } from "./album/album.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlbumComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  private session = inject(SessionService);
  
  ngOnInit(): void {
    this.session.initSessionData();
  }

}
