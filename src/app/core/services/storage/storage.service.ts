import { Injectable } from '@angular/core';
import { IAlbum, IPhoto, IPost, IUser } from '../api/response.dto';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  posts: IPost[] = [];
  users: IUser[] = [];
  albums: IAlbum[] = [];
  photos: IPhoto[] = [];
}
