import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-search',
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
        d="M17.5 17.5L22 22m-2-11a9 9 0 1 0-18 0a9 9 0 0 0 18 0"
        [attr.color]="color()"
      />
    </svg>
  `,
  styles: ``,
})
export class SearchIcon {
  size = input('16');
  color = input('currentColor');
}
