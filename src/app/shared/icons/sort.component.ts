import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-sort',
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        [attr.stroke]="color()"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M11 8h9m-8 4h6m-4 4h2M10 4h11M5.5 21V3m0 18c-.7 0-2.008-1.994-2.5-2.5M5.5 21c.7 0 2.008-1.994 2.5-2.5"
        [attr.color]="color()"
      />
    </svg>
  `,
  styles: ``,
})
export class SortIcon {
  size = input('16');
  color = input('currentColor');
}
