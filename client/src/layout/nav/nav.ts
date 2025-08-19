import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected creds: any = {};
  protected accountService = inject(AccountService);

  login() {
    console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        console.log(result);
        this.creds = {}; //clear the object so that logout (click) will display blank email and password in login form
      },
      error: (err) => alert(err.message),
      complete: () => console.log('completed')
    })
  }

  logout() {
    this.accountService.logout();
  }
}
