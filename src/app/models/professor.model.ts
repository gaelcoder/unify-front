export interface Professor {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email: string; 
  telefone: string;
  titulacao: string;
  areaAtuacao: string;
  salario?: number; 
  universidadeId?: number;
}

export interface ProfessorDTO {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email?: string;
  telefone: string;
  titulacao: string;
  areaAtuacao: string;
  salario: number;
} 