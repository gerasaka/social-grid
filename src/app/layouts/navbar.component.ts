import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'navbar',
  imports: [RouterLink],
  template: `
    <div class="position-fixed w-100 start-0 z-3 px-4">
      <div class="container px-0">
        <nav class="d-flex align-items-center justify-content-between gap-4">
          <a routerLink="/" class="nav-text d-flex gap-2 align-items-center" style="flex: 1">
            <img src="./logo.svg" alt="logo" height="24px" />
            <span class="d-none d-sm-inline"> Social Grid </span>
          </a>
          <a routerLink="/posts" class="nav-text">Posts</a>
          <a routerLink="/albums" class="nav-text">Albums</a>
          <a routerLink="/photos" class="nav-text">Photos</a>

          <a routerLink="/users/1">
            <div style="width: 35px; height: 35px">
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt="profile preview"
                class="rounded-circle"
              />
            </div>
          </a>
        </nav>
      </div>
    </div>
  `,
  styles: [
    `
      nav {
        padding: 0.5rem 1.5rem;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 50px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(0, 0, 0, 0.176);

        .nav-text {
          font-size: 12px;
          font-weight: bold;
          color: black;
          text-decoration: none;

          @media (min-width: 576px) {
            font-size: 14px;
          }

          &:hover {
            color: rgb(90, 89, 89);
          }
        }
      }
    `,
  ],
})
export class NavbarComponent {}
