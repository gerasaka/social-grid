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

  private _bookmark_storage_id = 'bookmarked-post';
  bookmarkedPosts = signal<Record<string, IPost | undefined>>({});

  retrieveBookmarkedPosts() {
    const rawBookmark = localStorage.getItem(this._bookmark_storage_id);
    const postsFromStorage = JSON.parse(rawBookmark || '{}');
    this.bookmarkedPosts.set(postsFromStorage);
  }

  addBookmark(post: IPost) {
    this.bookmarkedPosts()[post.id] = post;
    this.updateBookmarkStorage();
  }

  removeBookmark(id: number) {
    this.bookmarkedPosts()[id] = undefined;
    this.updateBookmarkStorage();
  }

  updateBookmarkStorage() {
    const stringifyPosts = JSON.stringify(this.bookmarkedPosts());
    localStorage.setItem(this._bookmark_storage_id, stringifyPosts);
  }
}
