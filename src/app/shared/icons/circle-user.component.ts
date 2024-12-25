import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-circle-user',
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
        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
        <path
          d="M14.75 9.5a2.75 2.75 0 1 1-5.5 0a2.75 2.75 0 0 1 5.5 0M5.5 19l.56-.98a5 5 0 0 1 4.342-2.52h3.196a5 5 0 0 1 4.342 2.52l.56.98"
        />
      </g>
    </svg>
  `,
  styles: ``,
})
export class CircleUserIcon {
  size = input('16');
  color = input('currentColor');
}
