import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';
import { IPost, IUser } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { ArrowLeftIcon } from '../../shared/icons/arrow-left.component';
import { BookmarkFillIcon } from '../../shared/icons/bookmark-fill.component';
import { BookmarkIcon } from '../../shared/icons/bookmark.component';

@Component({
  selector: 'post-details',
  imports: [RouterLink, ArrowLeftIcon, BookmarkIcon, BookmarkFillIcon],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export class PostDetailsPage implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);

  loading = true;

  postDetails!: IPost;
  postAuthor!: IUser;
  bookmarked!: Boolean;

  ngOnInit(): void {
    const { id } = this.activeRoute.snapshot.params;

    this.apiService.getPostDetails$(id).subscribe({
      next: (res) => {
        this.postDetails = res;
        this.postAuthor = this.storageService.users()[this.postDetails.userId - 1];
        this.bookmarked = Boolean(this.storageService.bookmarkedPosts()[id]);
        this.loading = false;
      },
      error: () => this.router.navigate(['error']),
    });
  }

  bookmarkPost(post: IPost) {
    this.storageService.addBookmark(post);
  }

  removeBookmark(id: number) {
    this.storageService.removeBookmark(id);
  }

  back() {
    history.back();
  }
}
