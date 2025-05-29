export enum UserRole {
  AdminGeral = 'ROLE_ADMIN_GERAL',
  AdminUniversidade = 'ROLE_ADMIN_UNIVERSIDADE',
  Professor = 'ROLE_PROFESSOR',
  Aluno = 'ROLE_ALUNO',
  Funcionario = 'ROLE_FUNCIONARIO', // Standard employee
  FuncionarioRH = 'ROLE_FUNCIONARIO_RH' // RH employee
}

export interface User {
  email: string;
  tipo: UserRole; // Changed to use UserRole enum
  token: string;
  primeiroAcesso: boolean;
  universidadeNome?: string;      // Optional: Added from HeaderComponent observation
  universidadeLogoPath?: string;  // Optional: Added from HeaderComponent observation
  // Add id if available and useful on the frontend
  // id?: number;
}