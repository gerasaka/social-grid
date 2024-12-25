import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-favourite',
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
        d="M19.463 3.994c-2.682-1.645-5.023-.982-6.429.074c-.576.433-.864.65-1.034.65s-.458-.217-1.034-.65C9.56 3.012 7.219 2.349 4.537 3.994C1.018 6.153.222 13.274 8.34 19.284C9.886 20.427 10.659 21 12 21s2.114-.572 3.66-1.717c8.118-6.008 7.322-13.13 3.803-15.289"
        [attr.color]="color()"
      />
    </svg>
  `,
  styles: ``,
})
export class FavouriteIcon {
  size = input('16');
  color = input('currentColor');
}