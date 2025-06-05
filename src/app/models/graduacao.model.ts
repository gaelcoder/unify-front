export interface GraduacaoDTO {
  titulo: string;
  semestres: number;
  codigoCurso: string;
  coordenadorDoCursoId?: number;
  campusDisponiveis?: string[];
}

export interface Graduacao {
  id: number;
  titulo: string;
  semestres: number;
  codigoCurso: string;
  universidade: {
    id: number;
    nome: string;
  };
  coordenadorDoCurso?: {
    id: number;
    nome?: string;
  };
  campusDisponiveis?: string[];
  materias?: any[];
  alunos?: any[];
} 