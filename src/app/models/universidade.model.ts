export interface Universidade {
  id?: number;
  nome: string;
  cnpj: string;
  fundacao: string; // formato ISO YYYY-MM-DD
  sigla: string;
  campus: string[];
  representante?: any;
}

export interface UniversidadeDTO {
  nome: string;
  cnpj: string;
  fundacao: string;
  sigla: string;
  campus: string[];
}
