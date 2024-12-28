import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api/api.service';
import { IAlbum, IPhoto } from '../../core/services/api/response.dto';
import { AlbumIcon } from '../../shared/icons/album.component';
import { ArrowLeftIcon } from '../../shared/icons/arrow-left.component';

@Component({
  selector: 'photo-details',
  imports: [CommonModule, RouterLink, ArrowLeftIcon, AlbumIcon],
  templateUrl: './photo-details.component.html',
  styleUrl: './photo-details.component.scss',
})
export class PhotoDetailsPage implements OnInit {
  private apiService = inject(ApiService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  loading = true;
  photo!: IPhoto;
  album!: IAlbum;

  ngOnInit(): void {
    const { id } = this.activeRoute.snapshot.params;

    this.apiService
      .getPhotoDetails$(id)
      .pipe(
        switchMap((res) => {
          this.photo = res;
          return this.apiService.getAlbumDetails$(res.id);
        }),
      )
      .subscribe({
        next: (res) => {
          this.album = res;
          this.loading = false;
        },
        error: () => this.router.navigate(['error']),
      });
  }

  back() {
    history.back();
  }
}
