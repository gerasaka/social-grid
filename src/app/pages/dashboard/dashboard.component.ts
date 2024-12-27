import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhotoCardComponent } from '../../components/photo-card/photo-card.component';
import { IPhoto, IPost } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { AlbumIcon } from '../../shared/icons/album.component';
import { CircleUserIcon } from '../../shared/icons/circle-user.component';
import { PhotoIcon } from '../../shared/icons/photo.component';
import { PostIcon } from '../../shared/icons/post.component';

@Component({
  selector: 'dashboard',
  imports: [
    CommonModule,
    RouterLink,
    PhotoCardComponent,
    PostIcon,
    AlbumIcon,
    PhotoIcon,
    CircleUserIcon,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardPage implements OnInit {
  private storageService = inject(StorageService);

  recentPosts!: IPost[];
  newPhotos!: IPhoto[];

  ngOnInit(): void {
    this.recentPosts = this.storageService.posts.slice(0, 5);
    this.newPhotos = this.storageService.photos.slice(0, 10);
  }

  getPostAuthor(id: number) {
    const { name } = this.storageService.users()[Number(id)];
    return name;
  }
}
