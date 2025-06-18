import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model'; // Ensure UserRole is imported

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const currentUser = authService.currentUserValue;
  
  // --- Start Enhanced Debug Logging ---
  console.log(`%c[AuthGuard DEBUG] Start for URL: ${state.url}`, 'color: blue; font-weight: bold;');
  console.log(`[AuthGuard DEBUG] Route path config: ${route.routeConfig?.path}`);
  console.log(`[AuthGuard DEBUG] Current User (raw):`, currentUser);
  console.log(`[AuthGuard DEBUG] Current User (JSON): ${JSON.stringify(currentUser)}`);
  console.log(`[AuthGuard DEBUG] Expected roles for this route (raw):`, route.data['roles']);
  console.log(`[AuthGuard DEBUG] Expected roles for this route (JSON): ${JSON.stringify(route.data['roles'])}`);
  // --- End Enhanced Debug Logging ---

  if (currentUser) {
    console.log(`[AuthGuard DEBUG] User is present. User type from currentUser.tipo: ${currentUser.tipo}`);
    
    if (currentUser.primeiroAcesso && state.url !== '/trocar-senha') {
      console.warn(`%c[AuthGuard DEBUG] PRIMEIRO ACESSO! Redirecting from ${state.url} to /trocar-senha.`, 'color: orange;');
      return router.createUrlTree(['/trocar-senha']);
    }

    const routeRoles = route.data['roles'] as Array<UserRole | string>;
    if (routeRoles && routeRoles.length > 0) {
      // Split the user's roles string into an array
      const userRoles = (currentUser.tipo as string).split(',');
      
      // Check if any of the user's roles match any of the required roles
      const userHasRole = userRoles.some(userRole => 
        routeRoles.some(routeRole => userRole.trim() === routeRole)
      );

      console.log(`[AuthGuard DEBUG] Role check needed. User roles: '${userRoles.join("', '")}'. Expected roles: ['${routeRoles.join("', '")}']. User has role: ${userHasRole}`);

      if (!userHasRole) {
        console.error(`%c[AuthGuard DEBUG] ROLE MISMATCH! User roles '${userRoles.join("', '")}' NOT in expected ['${routeRoles.join("', '")}']. Redirecting from ${state.url} to /login.`, 'color: red;');
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
      console.log(`%c[AuthGuard DEBUG] ROLE MATCH! Access granted to ${state.url}.`, 'color: green;');
    } else {
      console.log(`[AuthGuard DEBUG] No specific roles required for ${state.url}. Access granted.`);
    }

    console.log(`%c[AuthGuard DEBUG] Final access GRANTED to ${state.url}.`, 'color: green; font-weight: bold;');
    return true;
  }

  console.error(`%c[AuthGuard DEBUG] NO CURRENT USER. Redirecting from ${state.url} to /login.`, 'color: red;');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};