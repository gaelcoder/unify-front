import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const currentUser = authService.currentUserValue;
  
  console.log(`[AuthGuard] Checking route: ${state.url}`);
  console.log(`[AuthGuard] Current User:`, currentUser);
  console.log(`[AuthGuard] Expected roles:`, route.data['roles']);

  if (currentUser) {
    console.log(`[AuthGuard] User is present. User type: ${currentUser.tipo}`);
    // Verifica se é primeiro acesso
    if (currentUser.primeiroAcesso && state.url !== '/trocar-senha') {
      console.log(`[AuthGuard] User is primeiroAcesso. Redirecting to /trocar-senha.`);
      router.navigate(['/trocar-senha']);
      return false;
    }

    // Verifica se o usuário tem as permissões necessárias para a rota
    if (route.data['roles']) {
      if (!currentUser.tipo || !route.data['roles'].includes(currentUser.tipo)) {
        console.warn(`[AuthGuard] Role mismatch. User type: ${currentUser.tipo}, Expected roles: ${route.data['roles']}. Redirecting to /login (or /acesso-negado).`);
        // Redirect to login or a dedicated access denied page. Keeping /login for now to match observed behavior.
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); 
        return false;
      }
      console.log(`[AuthGuard] Role match. User type: ${currentUser.tipo}. Access granted to ${state.url}.`);
    }

    // Autorizado (either no roles specified on route, or role match)
    console.log(`[AuthGuard] Access granted to ${state.url} (or no specific roles required).`);
    return true;
  }

  // Não está logado, redireciona para a página de login
  console.log(`[AuthGuard] No current user. Redirecting to /login for ${state.url}.`);
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};