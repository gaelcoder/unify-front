import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, senha: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(
        map(response => {
          // Armazena os dados do usuário incluindo o token
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
          
          // Também armazenar o tipo separadamente para compatibilidade
          localStorage.setItem('userType', response.tipo);
          
          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAdminGeral(): boolean {
    const userType = localStorage.getItem('userType');
    return userType === 'ROLE_ADMIN_GERAL';
  }

  isAdminUniversidade(): boolean {
    const userType = localStorage.getItem('userType');
    return userType === 'ROLE_ADMIN_UNIVERSIDADE';
  }
  
  isPrimeiroAcesso(): boolean {
    const user = this.currentUserValue;
    return user && user.primeiroAcesso === true;
  }

  alterarSenhaPrimeiroAcesso(novaSenha: string) {
    const user = this.currentUserValue;
    const userId = user ? user.id : null;
    
    if (!userId) {
      throw new Error('Usuário não está logado');
    }
    
    return this.http.post<any>(`${this.apiUrl}/auth/primeiro-acesso`, {
      id: userId,
      novaSenha
    }).pipe(
      map(response => {
        // Atualiza o usuário no storage para refletir que não é mais primeiro acesso
        const updatedUser = {...user, primeiroAcesso: false};
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        return response;
      })
    );
  }
}