import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-photo',
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        [attr.stroke]="color()"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        [attr.color]="color()"
      >
        <circle cx="7.5" cy="7.5" r="1.5" />
        <path
          d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"
        />
        <path d="M5 21c4.372-5.225 9.274-12.116 16.498-7.458" />
      </g>
    </svg>
  `,
  styles: ``,
})
export class PhotoIcon {
  size = input('16');
  color = input('currentColor');
}