export interface Professor {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string; // Consider using Date type after conversion
  email: string; // Personal email
  emailInstitucional: string; // Institutional email, usually generated
  telefone: string;
  titulacao: string;
  areaAtuacao: string;
  salario?: number; // Add salario as optional here as it might not always be present in every context
  universidadeId?: number; // Assuming it might be useful to have university ID
}

export interface ProfessorDTO {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email?: string; // Personal email, optional during creation as institutional is generated
  telefone: string;
  titulacao: string; // e.g., "Mestre", "Doutor"
  areaAtuacao: string;
  salario: number; // Salario is mandatory in DTO for creation/update
  // universidadeId is typically derived from the logged-in RH user on the backend
} 