import { Aluno } from "./aluno.model";
import { Materia } from "./materia.model";
import { Professor } from "./professor.model";

export interface Turma {
  id: number;
  materia: Materia;
  professor: Professor;
  turno: string;
  diaSemana: string;
  campus: string;
  limiteAlunos: number;
  alunos: Aluno[];
}

export interface TurmaCreate {
  materiaId: number;
  professorId: number;
  turno: string;
  diaSemana: string;
  campus: string;
  limiteAlunos: number;
  alunoIds: number[];
} 