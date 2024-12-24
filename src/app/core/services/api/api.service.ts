import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { IAlbum, IPhoto, IPost, IUser } from './response.dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  private API_BASE_URL = 'https://jsonplaceholder.typicode.com';

  getAllPosts() {
    return this.http
      .get<IPost[]>(this.API_BASE_URL + '/posts')
      .pipe(tap((res) => this.storageService.posts$.set(res)));
  }

  getPostDetails(id: number) {
    return this.http.get<IPost>(this.API_BASE_URL + '/posts/' + id);
  }

  getUserDetails(id: number) {
    return this.http.get<IUser>(this.API_BASE_URL + '/users/' + id);
  }

  getAllAlbums() {
    return this.http
      .get<IAlbum[]>(this.API_BASE_URL + '/albums')
      .pipe(tap((res) => this.storageService.albums$.set(res)));
  }

  getAlbumDetails(id: number) {
    return this.http.get<IAlbum>(this.API_BASE_URL + '/albums/' + id);
  }

  getAllPhotos() {
    return this.http
      .get<IPhoto[]>(this.API_BASE_URL + '/photos')
      .pipe(tap((res) => this.storageService.photos$.set(res)));
  }

  getPhotoDetails(id: number) {
    return this.http.get<IPhoto>(this.API_BASE_URL + '/photos/' + id);
  }
}
