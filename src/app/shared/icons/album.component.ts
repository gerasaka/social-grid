import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-album',
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
        <path
          d="M6 17.975c.129 1.308.42 2.189 1.077 2.846C8.256 22 10.154 22 13.949 22s5.693 0 6.872-1.18C22 19.643 22 17.745 22 13.95s0-5.693-1.18-6.872c-.656-.657-1.537-.948-2.846-1.077"
        />
        <path
          d="M2 10c0-3.771 0-5.657 1.172-6.828S6.229 2 10 2s5.657 0 6.828 1.172S18 6.229 18 10s0 5.657-1.172 6.828S13.771 18 10 18s-5.657 0-6.828-1.172S2 13.771 2 10"
        />
        <path
          d="M2 11.119a15 15 0 0 1 1.872-.117c2.652-.049 5.239.674 7.3 2.04C13.081 14.31 14.424 16.053 15 18M13 7h.009"
        />
      </g>
    </svg>
  `,
  styles: ``,
})
export class AlbumIcon {
  size = input('16');
  color = input('currentColor');
}