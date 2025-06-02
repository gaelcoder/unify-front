export interface AvaliacaoDTO {
    id?: number; // Opcional ao criar
    turmaId: number;
    nome: string; // Ex: "Prova 1", "Trabalho em Grupo"
    dataPrevista?: string; // ISO Date format (YYYY-MM-DD)
    valorMaximoPossivel: number;
} 