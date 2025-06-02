export enum UserRole {
  AdminGeral = 'ROLE_ADMIN_GERAL',
  AdminUniversidade = 'ROLE_ADMIN_UNIVERSIDADE',
  Professor = 'ROLE_PROFESSOR',
  Aluno = 'ROLE_ALUNO',
  Funcionario = 'ROLE_FUNCIONARIO',
  FuncionarioRH = 'ROLE_FUNCIONARIO_RH'
}

export interface User {
  email: string;
  tipo: UserRole;
  token: string;
  primeiroAcesso: boolean;
  universidadeNome?: string;
  universidadeLogoPath?: string; 
}