# Implementação de Paginação - UniFy Frontend

## Visão Geral

Foi implementado um sistema completo de paginação para todas as tabelas do frontend do UniFy, incluindo:

- **Serviço de Paginação**: Gerencia o estado da paginação de forma centralizada
- **Componente de Controles**: Interface reutilizável para navegação entre páginas
- **Integração em Componentes**: Todas as tabelas principais agora possuem paginação

## Funcionalidades Implementadas

### 1. Controles de Paginação
- **Navegação entre páginas**: Botões para primeira, anterior, próxima e última página
- **Seletor de itens por página**: Opções de 5, 10, 25, 50 itens por página
- **Botão "Mostrar Todos"**: Permite visualizar todos os itens em uma única página
- **Indicador de progresso**: Mostra "Mostrando X-Y de Z itens"

### 2. Componentes Atualizados

#### Secretaria
- ✅ **Lista de Matérias** (`funcionario-secretaria-materia-list`)
- ✅ **Lista de Graduações** (`funcionario-secretaria-graduacao-list`)
- ✅ **Lista de Alunos** (`funcionario-secretaria-aluno-list`)
- ✅ **Lista de Turmas** (`turma-list`)

#### Administração
- ✅ **Lista de Professores** (`professor-list`)
- ✅ **Lista de Representantes** (`representante-list`)
- ✅ **Lista de Universidades** (`universidade-list`)

### 3. Arquivos Criados/Modificados

#### Novos Arquivos
- `src/app/core/services/pagination.service.ts` - Serviço central de paginação
- `src/app/core/components/pagination-controls/pagination-controls.component.ts` - Componente de controles

#### Arquivos Modificados
- Todos os componentes de lista mencionados acima
- Adicionadas dependências do Angular Material (se necessário)

## Como Usar

### 1. Importar o Serviço
```typescript
import { PaginationService, PaginationConfig } from '../../../core/services/pagination.service';
```

### 2. Importar o Componente
```typescript
import { PaginationControlsComponent } from '../../../core/components/pagination-controls/pagination-controls.component';
```

### 3. Configurar no Componente
```typescript
export class MeuComponente implements OnInit, OnDestroy {
  dados: any[] = [];
  dadosPaginados: any[] = [];
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(private paginationService: PaginationService) {
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe(state => {
      this.atualizarDadosPaginados();
    });
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  carregarDados(): void {
    this.meuService.listar().subscribe({
      next: (data) => {
        this.dados = data;
        this.paginationService.setTotalItems(data.length);
        this.atualizarDadosPaginados();
      }
    });
  }

  atualizarDadosPaginados(): void {
    this.dadosPaginados = this.paginationService.getPaginatedData(this.dados);
  }
}
```

### 4. Adicionar no Template
```html
<table>
  <tbody>
    <tr *ngFor="let item of dadosPaginados">
      <!-- Conteúdo da tabela -->
    </tr>
  </tbody>
</table>

<app-pagination-controls 
  *ngIf="dados.length > 0"
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)"
  (pageSizeChange)="onPageSizeChange($event)"
  (showAllToggle)="onShowAllToggle($event)">
</app-pagination-controls>
```

## Configurações Disponíveis

### PaginationConfig
```typescript
{
  pageSize: 10,                    // Itens por página padrão
  pageSizeOptions: [5, 10, 25, 50], // Opções disponíveis
  showFirstLastButtons: true,      // Mostrar botões primeira/última
  showAllOption: true             // Mostrar botão "Mostrar Todos"
}
```

## Benefícios

1. **Performance**: Reduz o carregamento de dados desnecessários
2. **Usabilidade**: Interface mais limpa e navegável
3. **Flexibilidade**: Usuário pode escolher quantos itens ver por página
4. **Consistência**: Padrão uniforme em todas as tabelas
5. **Responsividade**: Funciona bem em diferentes tamanhos de tela

## Próximos Passos

Para implementar em novos componentes:

1. Seguir o padrão estabelecido nos componentes já atualizados
2. Importar o `PaginationService` e `PaginationControlsComponent`
3. Implementar a lógica de paginação conforme o exemplo acima
4. Testar a funcionalidade em diferentes cenários

## Observações

- O serviço de paginação é singleton e mantém o estado global
- Cada componente pode ter sua própria configuração de paginação
- A paginação é client-side (processada no frontend)
- Todos os componentes implementados seguem o mesmo padrão para consistência 