import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';
import { IPost, IUser } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { ArrowLeftIcon } from '../../shared/icons/arrow-left.component';
import { GlobeIcon } from '../../shared/icons/globe.component';
import { MailIcon } from '../../shared/icons/mail.component';
import { PhoneIcon } from '../../shared/icons/phone.component';
import { PinIcon } from '../../shared/icons/pin.component';
import { SortIcon } from '../../shared/icons/sort.component';

@Component({
  selector: 'user-profile',
  imports: [RouterLink, ArrowLeftIcon, SortIcon, MailIcon, PhoneIcon, GlobeIcon, PinIcon],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfilePage implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private apiService = inject(ApiService);

  pageState: 'LOADING' | 'COMPLETE' | 'ERROR' = 'LOADING';
  user!: IUser;
  posts!: IPost[];

  ngOnInit(): void {
    const { id } = this.activeRoute.snapshot.params;

    this.apiService.getUserDetails$(id).subscribe({
      next: (res) => {
        this.user = res;
        this.posts = this.storageService.posts.filter((post) => post.userId === Number(id));
        this.pageState = 'COMPLETE';
      },
      error: () => this.pageState === 'ERROR',
    });
  }

  back() {
    history.back();
  }
}
