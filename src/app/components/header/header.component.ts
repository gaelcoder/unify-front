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
      if (user) {
        this.universidadeNome = user.universidadeNome || null;
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

  getDashboardPath(): string {
    if (this.authService.isAdminGeral()) {
      return '/dashboard-admin-geral';
    } else if (this.authService.isAdminUniversidade()) {
      return '/dashboard-admin-universidade';
    } else if (this.currentUser) {
      return '/home'; 
    }
    return '/login';
  }

  testDashboardClick() {
    console.log('HeaderComponent: Dashboard link clicked via (click) handler. Attempting to navigate to /dashboard-admin-geral...');
    this.router.navigate(['/dashboard-admin-geral'])
      .then(navigated => {
        console.log('[HeaderComponent] Navigation promise resolved. Navigated:', navigated);
        if (!navigated) {
          console.warn('[HeaderComponent] Navigation was not successful (e.g., guard returned false or route not found).');
        }
      })
      .catch(err => {
        console.error('[HeaderComponent] Navigation promise rejected with error:', err);
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
