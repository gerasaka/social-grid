import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ListLoadingComponent } from './components/list-loading.component';
import { ApiService } from './core/services/api/api.service';
import { StorageService } from './core/services/storage/storage.service';
import { NavbarComponent } from './layouts/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ListLoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  pageState: 'LOADING' | 'COMPLETE' = 'LOADING';

  ngOnInit(): void {
    forkJoin([
      this.apiService.getAllPosts$(),
      this.apiService.getAllAlbums$(),
      this.apiService.getAllPhotos$(),
    ]).subscribe({
      next: ([posts, albums, photos]) => {
        this.storageService.posts = posts;
        this.storageService.albums = albums;
        this.storageService.photos = photos;

        this.pageState = 'COMPLETE';
      },
      error: () => this.router.navigate(['error']),
    });

    this.apiService.loadUsers();
    this.storageService.retrieveBookmarkedPosts();
  }
}
