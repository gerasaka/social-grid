import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IPhoto } from '../../core/services/api/response.dto';

@Component({
  selector: 'photo-card',
  imports: [RouterLink],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  photo = input.required<IPhoto>();
}
