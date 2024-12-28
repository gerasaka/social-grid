import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { ApiService } from '../../core/services/api/api.service';
import { IPost, IUser } from '../../core/services/api/response.dto';
import { StorageService } from '../../core/services/storage/storage.service';
import { ArrowLeftIcon } from '../../shared/icons/arrow-left.component';
import { GlobeIcon } from '../../shared/icons/globe.component';
import { MailIcon } from '../../shared/icons/mail.component';
import { PhoneIcon } from '../../shared/icons/phone.component';
import { PinIcon } from '../../shared/icons/pin.component';

@Component({
  selector: 'user-profile',
  imports: [PostCardComponent, ArrowLeftIcon, MailIcon, PhoneIcon, GlobeIcon, PinIcon],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfilePage implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  loading = true;
  user!: IUser;
  posts!: IPost[];

  ngOnInit(): void {
    const { id } = this.activeRoute.snapshot.params;

    this.apiService.getUserDetails$(id).subscribe({
      next: (res) => {
        this.user = res;
        this.posts = this.storageService.posts.filter((post) => post.userId === Number(id));
        this.loading = false;
      },
      error: () => this.router.navigate(['error']),
    });
  }

  back() {
    history.back();
  }
}
