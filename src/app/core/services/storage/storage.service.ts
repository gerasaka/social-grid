import { Injectable, signal } from '@angular/core';
import { IAlbum, IPhoto, IPost, IUser } from '../api/response.dto';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  users = signal<IUser[]>([]);
  posts: IPost[] = [];
  albums: IAlbum[] = [];
  photos: IPhoto[] = [];
}
