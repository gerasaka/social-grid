import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'navbar',
  imports: [RouterLink],
  template: `
    <div class="position-fixed w-100 start-0 z-3">
      <nav
        class="d-flex justify-content-center align-items-center gap-4 m-auto"
        style="width: min-content"
      >
        <a routerLink="/" class="nav-text">Dashboard</a>
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
  `,
  styles: [
    `
      nav {
        padding: 0.5rem 1.5rem;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 50px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(0, 0, 0, 0.176);
        font-size: 0.75rem;

        @media (min-width: 576px) {
          font-size: 1rem;
        }

        .nav-text {
          font-weight: bold;
          color: black;
          text-decoration: none;

          &:hover {
            color: rgb(90, 89, 89);
          }
        }
      }
    `,
  ],
})
export class NavbarComponent {}
