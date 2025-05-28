import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  private currentUserSubscription!: Subscription;
  universidadeNome: string | null = null;
  universidadeLogoUrl: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user && user.universidadeNome) {
        this.universidadeNome = user.universidadeNome;
        if (user.universidadeLogoPath) {
          this.universidadeLogoUrl = `http://localhost:8080/api/files/${user.universidadeLogoPath}`;
        } else {
          this.universidadeLogoUrl = null; // Or a default logo
        }
      } else {
        this.universidadeNome = null;
        this.universidadeLogoUrl = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    // Navigation to login page is handled by authService.logout()
  }
}
