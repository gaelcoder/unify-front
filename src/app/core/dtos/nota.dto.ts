export interface NotaDTO {
    id?: number; // Opcional ao criar/atualizar
    alunoId: number;
    avaliacaoId: number;
    valorObtido: number | null; // Permitir null se a nota não foi lançada
    observacoes?: string;
    // Campos adicionais para exibição, se necessário (preenchidos no frontend ou por um DTO de resposta mais rico)
    alunoNome?: string; 
} 