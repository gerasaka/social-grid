import { Component } from '@angular/core';

@Component({
  selector: 'error',
  imports: [],
  template: `
    <div class="text-center mt-4">
      <h1>Oops, Error occurs</h1>
      <p>Please try again later</p>
    </div>
  `,
  styles: [],
})
export class ErrorPage {}
