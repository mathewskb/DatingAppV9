import { Component, inject, signal } from '@angular/core';
import { Nav } from "../layout/nav/nav";
import { Router, RouterOutlet } from '@angular/router'


@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected router = inject(Router);
}

// code for reference. usage

// async getMembers() {
  //   try {
  //     return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }

  // }

  //  ngOnInit(): void {
  //     this.http.get('https://localhost:5001/api/members').subscribe({
  //       next: resp => this.members.set(resp),
  //       error: err => console.log(err),
  //       complete : () =>console.log('http request completed')
  //     });
  //   }