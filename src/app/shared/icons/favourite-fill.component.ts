import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-favourite-fill',
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
    >
      <path
        [attr.fill]="color()"
        d="m11.645 20.91l-.007-.003l-.022-.012l-.082-.045q-.108-.06-.301-.173a25.2 25.2 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25C2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052A5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25c0 3.925-2.438 7.111-4.739 9.256a25 25 0 0 1-4.244 3.17a15 15 0 0 1-.383.219l-.022.012l-.007.004l-.003.001a.75.75 0 0 1-.704 0z"
      />
    </svg>
  `,
  styles: ``,
})
export class FavouriteFillIcon {
  size = input('16');
  color = input('currentColor');
}
