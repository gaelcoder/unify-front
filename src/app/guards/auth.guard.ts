import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const currentUser = authService.currentUserValue;
  
  if (currentUser) {
    // Verifica se é primeiro acesso
    if (currentUser.primeiroAcesso && state.url !== '/trocar-senha') {
      // Redireciona para a página de troca de senha
      router.navigate(['/trocar-senha']);
      return false;
    }

    // Verifica se o usuário tem as permissões necessárias para a rota
    if (route.data['roles']) {
      const userType = localStorage.getItem('userType');
      if (!route.data['roles'].includes(userType)) {
        // Redireciona para a página de acesso não autorizado
        router.navigate(['/acesso-negado']);
        return false;
      }
    }

    // Autorizado
    return true;
  }

  // Não está logado, redireciona para a página de login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};