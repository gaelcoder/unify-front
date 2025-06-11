import { Aluno } from './aluno.model';
import { Universidade } from './universidade.model';

export enum TipoSolicitacao {
    TRC = "TRC - Trancamento de Matrícula",
    TFG = "TFG - Transferência de Graduação",
    TRM = "TRM - Troca de Turma",
    HIST = "EHE - Emissão de Histórico Escolar",
    MAT = "EMT - Emissão de Declaração de Matrícula"
}

export enum StatusSolicitacao {
    ABERTA = 'ABERTA',
    CONCLUIDA = 'CONCLUIDA',
    REJEITADA = 'REJEITADA'
}

export interface Solicitacao {
    id: number;
    tipo: TipoSolicitacao;
    mensagem: string;
    status: StatusSolicitacao;
    dataSolicitacao: string; // LocalDateTime is a string in JSON
    aluno: Aluno;
    universidade: Universidade;
}

export interface SolicitacaoCreateDTO {
    tipo: TipoSolicitacao;
    mensagem: string;
    alunoId: number;
    universidadeId: number;
}

export interface SolicitacaoSecretariaDTO {
    id: number;
    protocolo: string;
    matriculaAluno: string;
    nomeAluno: string;
    tipo: TipoSolicitacao;
    campus: string;
}

export interface SolicitacaoStatusUpdateDTO {
    status: StatusSolicitacao;
} 