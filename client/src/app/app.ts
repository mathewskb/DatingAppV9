import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('Dating app');
  protected readonly http = inject(HttpClient);
  protected members = signal<any>([]);

  async ngOnInit(){
    this.members.set(await this.getMembers())
  }

  async getMembers() {

    try {
      return lastValueFrom(this.http.get('https://localhost:5001/api/members'));
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
