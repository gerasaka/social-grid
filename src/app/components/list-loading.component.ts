import { Component } from '@angular/core';

@Component({
  selector: 'list-loading',
  imports: [],
  template: `
    <div class="placeholder-glow">
      <div class="placeholder rounded col-5 mb-2" style="height: 2.375rem"></div>
      <br />
      <div class="placeholder rounded col-7 mb-4" style="height: 1.5rem"></div>
    </div>

    <div
      class="placeholder-glow d-flex justify-content-between justify-content-md-start gap-3 mb-4"
    >
      <span class="placeholder rounded" style="height: 2.375rem; width: 10rem"></span>
      <span class="placeholder rounded" style="height: 2.375rem; width: 8rem"></span>
    </div>

    <div class="post-container placeholder-glow">
      <span class="placeholder rounded-3 loading-card"></span>
      <span class="placeholder rounded-3 loading-card"></span>
      <span class="placeholder rounded-3 loading-card"></span>
      <span class="placeholder rounded-3 loading-card"></span>
    </div>
  `,
  styles: [
    `
      .post-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }
    `,
    `
      .loading-card {
        height: 13rem;
      }
    `,
  ],
})
export class ListLoadingComponent {}
