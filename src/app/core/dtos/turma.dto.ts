export interface TurmaDTO {
    id: number;
    nomeMateria: string; // Ex: "Cálculo I"
    codigoGraduacao?: string; // Ex: "CC001"
    nomeGraduacao?: string; // Ex: "Ciência da Computação"
    turno?: string; // MANHA, TARDE, NOITE
    professorId?: number;
    // Adicionar mais campos conforme necessário para exibição no dashboard do professor
} 