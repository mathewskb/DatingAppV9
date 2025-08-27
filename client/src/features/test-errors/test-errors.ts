import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';


@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css'
})
export class TestErrors {
  private http = inject(HttpClient);
  private baseURL = 'https://localhost:5001/api/';
  validationErrors = signal<string[]>([]);
  
  get404Error() {
    this.http.get(this.baseURL + 'buggy/not-found').subscribe({
      next: (resp) => console.log(resp),
      error:(err) => console.error(err),
      complete: () => console.log('request completed')
    })
  }

  get400Error() {
    this.http.get(this.baseURL + 'buggy/bad-request').subscribe({
      next: (resp) => console.log(resp),
      error:(err) => console.error(err),
      complete: () => console.log('request completed')
    })
  }

  get500Error() {
    this.http.get(this.baseURL + 'buggy/server-error').subscribe({
      next: (resp) => console.log(resp),
      error:(err) => console.error(err),
      complete: () => console.log('request completed')
    })
  }

  get401Error() {
    this.http.get(this.baseURL + 'buggy/auth').subscribe({
      next: (resp) => console.log(resp),
      error:(err) => console.error(err),
      complete: () => console.log('request completed')
    })
  }

   get400ValidationError() {
    this.http.post(this.baseURL + 'account/register', {}).subscribe({
      next: (resp) => console.log(resp),
      error:(err) => {
        console.error(err);
        this.validationErrors.set(err);
      },
      complete: () => console.log('request completed')
    })
  }
}
