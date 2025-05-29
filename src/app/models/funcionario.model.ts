export interface Funcionario {
    id: number;
    nome: string;
    sobrenome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    setor: string;
    universidade?: any;
  }
  
  export interface FuncionarioDTO {
    nome: string;
    sobrenome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    setor: string;
  }
  