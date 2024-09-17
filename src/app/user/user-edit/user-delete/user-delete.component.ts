import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './user-delete.component.html',
  styleUrl: '../user-edit.component.css',
})
export class UserDeleteComponent {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  deleteSig = output<boolean>();

  password: string = '';

  requestDeleteUser() {
    const sub = this.httpClient
      .delete('http://localhost:3000/user/12', {
        observe: 'response',
      })
      .subscribe({
        next: (res) => {
          console.log(res.status + ': User Deleted');
          this.deleteSig.emit(true);
        },
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  cancel() {
    this.deleteSig.emit(false);
  }
}
