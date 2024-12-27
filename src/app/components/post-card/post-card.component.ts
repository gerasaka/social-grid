import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IPost } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { BookmarkFillIcon } from '../../shared/icons/bookmark-fill.component';
import { BookmarkIcon } from '../../shared/icons/bookmark.component';
import { CircleUserIcon } from '../../shared/icons/circle-user.component';

@Component({
  selector: 'post-card',
  imports: [CommonModule, RouterLink, CircleUserIcon, BookmarkIcon, BookmarkFillIcon],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  private storageService = inject(StorageService);

  post = input.required<IPost>();
  showAuthor = input(false);

  ngOnInit(): void {}

  getPostInfo(id: number) {
    const { name } = this.storageService.users()[id - 1];
    return { author: name, saved: false };
  }
}
