import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((c) => c.DashboardPage),
  },
  {
    path: 'posts',
    loadComponent: () => import('./pages/posts/posts.component').then((c) => c.PostsPages),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./pages/post-details/post-details.component').then((c) => c.PostDetailsPage),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then((c) => c.UserProfilePage),
  },
  {
    path: 'albums',
    loadComponent: () => import('./pages/albums/albums.component').then((c) => c.AlbumsPage),
  },
  {
    path: 'albums/:id',
    loadComponent: () =>
      import('./pages/album-details/album-details.component').then((c) => c.AlbumDetailsPage),
  },
  {
    path: 'photos',
    loadComponent: () => import('./pages/photos/photos.component').then((c) => c.PhotosPage),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./pages/photo-details/photo-details.component').then((c) => c.PhotoDetailsPage),
  },
  {
    path: 'error',
    loadComponent: () => import('./pages/error.component').then((c) => c.ErrorPage),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
