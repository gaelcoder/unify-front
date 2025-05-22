import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const currentUser = authService.currentUserValue;
  
  if (!currentUser) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return of(false);
  }

  if (route.data['roles'] && route.data['roles'].length > 0) {
    const requiredRoles = route.data['roles'] as string[];
    const hasRequiredRole = requiredRoles.some(role => 
      authService.hasRole(role)
    );
    
    if (!hasRequiredRole) {
      router.navigate(['/nao-autorizado']);
      return of(false);
    }
  }

  return authService.validateToken().pipe(
    tap(valid => {
      if (!valid) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
      
      if (valid && currentUser.primeiroAcesso) {
        router.navigate(['/trocar-senha']);
      }
    }),
    map(valid => valid),
    catchError(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};