import { Graduacao } from './graduacao.model';
import { Universidade } from './universidade.model'; // Assuming you have this model

// Interface for the data structure when fetching a Materia
export interface Materia {
  id: number;
  titulo: string;
  codigo: string;
  creditos: number;
  cargaHoraria: number;
  creditosNecessarios?: number; 
  universidade?: Universidade;
  graduacoes?: Graduacao[];
}

export interface MateriaDTO {
  id?: number;
  titulo: string;
  codigo: string;
  creditos: number;
  cargaHoraria: number;
  creditosNecessarios?: number;
  graduacaoIds: number[];
} 