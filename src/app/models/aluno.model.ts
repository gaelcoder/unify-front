export interface AlunoDTO {
    id?: number; // ID is optional for creation, present for update
    nome: string;
    sobrenome: string;
    cpf: string;
    dataNascimento: string; // Consider using Date type if appropriate for forms
    email: string;
    telefone: string;
    graduacaoId: number; // Changed from graduacaoIds: number[] to singular graduacaoId
    // universidadeId is typically determined by the logged-in Funcionario
    // and set on the backend, so it might not be part of the DTO sent from the frontend.
    // If it can be set from the frontend in some cases, add:
    // universidadeId?: number;
}

export interface Aluno {
    id: number;
    nome: string;
    sobrenome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    matricula: string;
    cr: number;
    graduacoes: Array<{ // Changed from graduacao to graduacoes and made it an array
        id: number;
        titulo: string; // Changed from nome to titulo
        // Add other graduacao details if needed
    }>;
    universidade: {
        id: number;
        nome: string;
        // Add other universidade details if needed
    };
    usuario?: { // Assuming a Usuario object might be linked
        id: number;
        email: string;
    };
    // Add any other relevant fields returned by the backend for a full Aluno view
}
  