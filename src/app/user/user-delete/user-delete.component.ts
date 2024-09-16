import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-delete.component.html',
  styleUrl: '../user.component.css',
})
export class UserDeleteComponent {

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  deleteSig = output<void>();

  password: string = '';

  requestDeleteUser() {
    const sub = this.httpClient.delete('http://localhost:3000/user/12', {
      observe: 'response'
    })
    .subscribe({
      next: (res) => {
        console.log(res.status + ': User Deleted');
        this.deleteSig.emit();
      }
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}

