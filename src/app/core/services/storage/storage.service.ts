import { Injectable, signal } from '@angular/core';
import { IAlbum, IPhoto, IPost } from '../api/response.dto';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  posts: IPost[] = [];
  albums$ = signal<IAlbum[]>([]);
  photos$ = signal<IPhoto[]>([]);
}
