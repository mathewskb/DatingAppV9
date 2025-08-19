import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('Dating app');
  private readonly http = inject(HttpClient);
  protected members = signal<User[]>([]);
  private accountService = inject(AccountService);

  async ngOnInit() {
    this.setCurrentUser();
    this.members.set(await this.getMembers())
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');

    if (!userString) return;

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }
  async getMembers() {

    try {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  //  ngOnInit(): void {
  //     this.http.get('https://localhost:5001/api/members').subscribe({
  //       next: resp => this.members.set(resp),
  //       error: err => console.log(err),
  //       complete : () =>console.log('http request completed')
  //     });
  //   }

}
