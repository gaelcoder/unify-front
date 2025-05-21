export interface Representante {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  cargo: string;
  universidade?: any;
}

export interface RepresentanteDTO {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  cargo: string;
}
