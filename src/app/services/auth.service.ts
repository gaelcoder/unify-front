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

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, senha: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(map(response => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('userType', response.tipo);
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAdminGeral(): boolean {
    return this.currentUserValue && this.currentUserValue.tipo === 'ROLE_ADMIN_GERAL';
  }

  isAdminUniversidade(): boolean {
    return this.currentUserValue && this.currentUserValue.tipo === 'ROLE_ADMIN_UNIVERSIDADE';
  }

  isFuncionarioRH(): boolean {
    return this.currentUserValue && this.currentUserValue.tipo === 'ROLE_FUNCIONARIO_RH';
  }

  isFuncionario(): boolean {
    return this.currentUserValue && this.currentUserValue.tipo === 'ROLE_FUNCIONARIO';
  }

  isProfessor(): boolean {
    return this.currentUserValue && this.currentUserValue.tipo === 'ROLE_PROFESSOR';
  }

  isAluno(): boolean {
    return this.currentUserValue && this.currentUserValue.tipo === 'ROLE_ALUNO';
  }

  isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;
    return !!currentUser && !!currentUser.token;
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