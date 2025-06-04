export interface GraduacaoDTO {
  titulo: string;
  semestres: number;
  codigoCurso: string;
  coordenadorDoCursoId?: number;
  campiDisponiveis?: string[];
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
  campiDisponiveis?: string[];
  materias?: any[];
  alunos?: any[];
} 