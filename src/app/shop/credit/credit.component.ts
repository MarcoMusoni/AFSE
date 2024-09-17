import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [],
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.css',
})
export class CreditComponent {
  
  amount = input.required<5 | 10 | 20>();
  selected = input.required<string>();
  toggleSig = output<number>();

  toggle() {
    this.toggleSig.emit(this.amount());
  }
}
