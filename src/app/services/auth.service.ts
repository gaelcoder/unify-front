import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base da API
  private apiUrl = 'http://localhost:8080/api/auth';
  
  // BehaviorSubject para manter o estado do usuário atual
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    // Inicializa com o usuário do localStorage (se existir)
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter para obter o valor atual do usuário
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Realiza o login do usuário
   * @param email Email do usuário
   * @param senha Senha do usuário
   */
  login(email: string, senha: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        map(response => {
          // Armazena os detalhes do usuário e o token JWT no localStorage
          const user: User = {
            email: response.email,
            tipo: response.tipo,
            token: response.token,
            primeiroAcesso: response.primeiroAcesso
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          console.error('Erro ao fazer login:', error);
          throw error;
        })
      );
  }

  /**
   * Realiza o logout do usuário
   */
  logout(): void {
    // Remove o usuário do localStorage
    localStorage.removeItem('currentUser');
    // Define o usuário atual como null
    this.currentUserSubject.next(null);
  }

  /**
   * Verifica se o token atual é válido
   */
  validateToken(): Observable<boolean> {
    const currentUser = this.currentUserValue;
    
    // Se não há usuário atual, não temos token para validar
    if (!currentUser) {
      return of(false);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUser.token}`
    });

    return this.http.post<any>(`${this.apiUrl}/validar`, {}, { headers })
      .pipe(
        map(response => {
          // Atualiza o usuário atual com as informações mais recentes
          const updatedUser: User = {
            email: response.email,
            tipo: response.tipo,
            token: response.token,
            primeiroAcesso: response.primeiroAcesso
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
          return true;
        }),
        catchError(error => {
          console.error('Token inválido:', error);
          this.logout(); // Se o token for inválido, faz logout
          return of(false);
        })
      );
  }

  /**
   * Troca a senha do usuário
   * @param senhaAtual Senha atual
   * @param novaSenha Nova senha
   */
  trocarSenha(senhaAtual: string, novaSenha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.currentUserValue?.token}`
    });

    return this.http.post(`${this.apiUrl}/trocar-senha`, 
      { senhaAtual, novaSenha }, 
      { headers }
    );
  }

  /**
   * Verifica se o usuário tem determinado papel
   * @param role Papel a ser verificado
   */
  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    // Remove o prefixo ROLE_ para comparação
    const userRole = user.tipo.replace('ROLE_', '');
    const checkRole = role.replace('ROLE_', '');
    
    return userRole === checkRole;
  }

  /**
   * Verifica se o usuário é admin geral
   */
  isAdminGeral(): boolean {
    return this.hasRole('ADMIN_GERAL');
  }

  /**
   * Verifica se o usuário é admin de universidade
   */
  isAdminUniversidade(): boolean {
    return this.hasRole('ADMIN_UNIVERSIDADE');
  }
}