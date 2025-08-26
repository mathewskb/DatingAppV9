import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';


@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink,RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected creds: any = {};
  protected router = inject(Router);
  protected accountService = inject(AccountService);
  private toast =inject(ToastService);

  login() {
    console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        console.log(result);
        this.creds = {}; //clear the object so that logout (click) will display blank email and password in login form
        this.router.navigateByUrl('/members');
        this.toast.info('Logged in successfully');
      },
      error: (err) => {
        this.toast.error(err.error);
      },
      complete: () => console.log('Request completed')
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
