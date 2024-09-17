import { Component, inject, OnInit } from '@angular/core';
import { SessionService } from './session.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private session = inject(SessionService);

  ngOnInit(): void {
    this.session.initSessionData();
  }
}
