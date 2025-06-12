import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUserItem = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUserItem ? JSON.parse(storedUserItem) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, senha: string): Observable<User & { targetPath: string }> {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(
        map(userResponse => {
          localStorage.setItem('currentUser', JSON.stringify(userResponse));
          this.currentUserSubject.next(userResponse);

          let targetPath = '/home'; // Default target path

          if (userResponse.primeiroAcesso) {
            this.router.navigate(['/trocar-senha']); 
            targetPath = '/trocar-senha';
          } else {
            const userRoles = userResponse.tipo ? (userResponse.tipo as string).split(',') : [];
            if (userRoles.includes(UserRole.FuncionarioRH)) {
              targetPath = '/painel-rh';
            } else if (userRoles.includes(UserRole.AdminGeral)) {
              targetPath = '/dashboard-admin-geral';
            } else if (userRoles.includes(UserRole.AdminUniversidade)) {
              targetPath = '/admin-universidade/dashboard';
            } else if (userRoles.includes(UserRole.Funcionario)) {
              targetPath = '/dashboard-secretaria';
            } else if (userRoles.includes(UserRole.Professor)) {
              targetPath = '/professor-dashboard';
            } else if (userRoles.includes(UserRole.Aluno)) {
              targetPath = '/aluno/dashboard';
            }
          }
          console.log(`[AuthService login] Determined targetPath: ${targetPath} for user type: ${userResponse.tipo}. Primeiro Acesso: ${userResponse.primeiroAcesso}`);
          return { ...userResponse, targetPath };
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAdminGeral(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.tipo && (user.tipo as string).split(',').includes(UserRole.AdminGeral);
  }

  isAdminUniversidade(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.tipo && (user.tipo as string).split(',').includes(UserRole.AdminUniversidade);
  }

  isFuncionarioRH(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.tipo && (user.tipo as string).split(',').includes(UserRole.FuncionarioRH);
  }

  isFuncionario(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.tipo && (user.tipo as string).split(',').includes(UserRole.Funcionario);
  }

  isAluno(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.tipo && (user.tipo as string).split(',').includes(UserRole.Aluno);
  }

  isProfessor(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.tipo && (user.tipo as string).split(',').includes(UserRole.Professor);
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.token;
  }

  isPrimeiroAcesso(): boolean {
    const user = this.currentUserValue;
    return !!user && user.primeiroAcesso === true;
  }
  
  alterarSenhaPrimeiroAcesso(novaSenha: string) {
    const user = this.currentUserValue;
    if (!user || !user.id) {
      console.error('User not logged in or user ID missing for alterarSenhaPrimeiroAcesso');
      throw new Error('Usuário não está logado ou ID do usuário está faltando'); 
    }
    
    return this.http.post<any>(`${this.apiUrl}/auth/primeiro-acesso`, {
      id: user.id,
      novaSenha
    }).pipe(
      map(response => {
        const updatedUser = {...user, primeiroAcesso: false};
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        return response;
      })
    );
  }

  isFuncionarioSecretaria(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.tipo && (user.tipo as string).split(',').includes(UserRole.Funcionario);
  }

  getUniversidadeId(): number | null {
    const user = this.currentUserValue;
    return user?.universidadeId || null;
  }
}