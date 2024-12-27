import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-arrow-left',
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
        d="M4 12h16M9 17s-5-3.682-5-5s5-5 5-5"
        [attr.color]="color()"
      />
    </svg>
  `,
  styles: ``,
})
export class ArrowLeftIcon {
  size = input('16');
  color = input('currentColor');
}
