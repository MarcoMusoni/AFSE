import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unpack',
  standalone: true,
  imports: [],
  templateUrl: './unpack.component.html',
})
export class UnpackComponent implements OnInit {
  
  private router = inject(Router);
  
  ngOnInit(): void {
    this.router.navigateByUrl('');
  }

}
