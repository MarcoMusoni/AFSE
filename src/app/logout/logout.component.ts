import { Component, inject, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  
  private session = inject(SessionService);
  private router = inject(Router);
  
  ngOnInit(): void {
    this.session.logout();
    this.router.navigateByUrl('');
  }

}
