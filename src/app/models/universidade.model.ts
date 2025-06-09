import { Representante } from './representante.model';

export interface Universidade {
  id: number;
  nome: string;
  cnpj: string;
  fundacao: string; // Using string for date to simplify data transfer
  sigla?: string;
  logoPath?: string;
  representante: Representante | null;
  campus: string[];
}

export interface UniversidadeCampusDTO {
  id: number;
  nome: string;
  campus: string[];
}

export interface UniversidadeDTO {
  nome: string;
  cnpj: string;
  fundacao: string;
  sigla: string;
  campus: string[];
}
