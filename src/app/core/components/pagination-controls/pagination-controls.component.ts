import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationService, PaginationState, PaginationConfig } from '../../services/pagination.service';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pagination-controls d-flex justify-content-between align-items-center mt-3">
      <!-- Show All Button -->
      <div class="d-flex align-items-center">
        <button 
          *ngIf="config.showAllOption"
          type="button" 
          class="btn btn-outline-secondary btn-sm me-3"
          (click)="toggleShowAll()"
          [class.btn-primary]="paginationState.showAll">
          {{ paginationState.showAll ? 'Mostrar Paginado' : 'Mostrar Todos' }}
        </button>
        
        <span *ngIf="!paginationState.showAll" class="text-muted small">
          Mostrando {{ getStartIndex() + 1 }}-{{ getEndIndex() }} de {{ paginationState.totalItems }} itens
        </span>
        <span *ngIf="paginationState.showAll" class="text-muted small">
          Mostrando todos os {{ paginationState.totalItems }} itens
        </span>
      </div>

      <!-- Page Size Selector -->
      <div *ngIf="!paginationState.showAll" class="d-flex align-items-center">
        <label for="pageSize" class="form-label me-2 mb-0 small">Itens por página:</label>
        <select 
          id="pageSize"
          class="form-select form-select-sm me-3" 
          style="width: auto;"
          [(ngModel)]="paginationState.pageSize"
          (change)="onPageSizeChange()">
          <option *ngFor="let size of config.pageSizeOptions" [value]="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Pagination Controls -->
      <div *ngIf="!paginationState.showAll && getTotalPages() > 1" class="d-flex align-items-center">
        <nav aria-label="Navegação de páginas">
          <ul class="pagination pagination-sm mb-0">
            <!-- First Page -->
            <li *ngIf="config.showFirstLastButtons" class="page-item" [class.disabled]="paginationState.currentPage === 0">
              <button 
                type="button" 
                class="page-link" 
                (click)="goToPage(0)"
                [disabled]="paginationState.currentPage === 0">
                <i class="fas fa-angle-double-left"></i>
              </button>
            </li>

            <!-- Previous Page -->
            <li class="page-item" [class.disabled]="paginationState.currentPage === 0">
              <button 
                type="button" 
                class="page-link" 
                (click)="goToPage(paginationState.currentPage - 1)"
                [disabled]="paginationState.currentPage === 0">
                <i class="fas fa-angle-left"></i>
              </button>
            </li>

            <!-- Page Numbers -->
            <li 
              *ngFor="let page of getVisiblePages()" 
              class="page-item" 
              [class.active]="page === paginationState.currentPage">
              <button 
                type="button" 
                class="page-link" 
                (click)="goToPage(page)">
                {{ page + 1 }}
              </button>
            </li>

            <!-- Next Page -->
            <li class="page-item" [class.disabled]="paginationState.currentPage >= getTotalPages() - 1">
              <button 
                type="button" 
                class="page-link" 
                (click)="goToPage(paginationState.currentPage + 1)"
                [disabled]="paginationState.currentPage >= getTotalPages() - 1">
                <i class="fas fa-angle-right"></i>
              </button>
            </li>

            <!-- Last Page -->
            <li *ngIf="config.showFirstLastButtons" class="page-item" [class.disabled]="paginationState.currentPage >= getTotalPages() - 1">
              <button 
                type="button" 
                class="page-link" 
                (click)="goToPage(getTotalPages() - 1)"
                [disabled]="paginationState.currentPage >= getTotalPages() - 1">
                <i class="fas fa-angle-double-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .pagination-controls {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 0.375rem;
      border: 1px solid #dee2e6;
    }
    
    .pagination .page-link {
      color: #495057;
      border-color: #dee2e6;
    }
    
    .pagination .page-item.active .page-link {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    
    .pagination .page-item.disabled .page-link {
      color: #6c757d;
      background-color: #fff;
      border-color: #dee2e6;
    }
  `]
})
export class PaginationControlsComponent implements OnInit {
  @Input() config!: PaginationConfig;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() showAllToggle = new EventEmitter<boolean>();

  paginationState: PaginationState;

  constructor(private paginationService: PaginationService) {
    this.paginationState = this.paginationService.getCurrentState();
  }

  ngOnInit(): void {
    if (!this.config) {
      this.config = this.paginationService.getDefaultConfig();
    }
    
    this.paginationService.getPaginationState().subscribe(state => {
      this.paginationState = state;
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.getTotalPages()) {
      this.paginationService.setPage(page);
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(): void {
    this.paginationService.setPageSize(this.paginationState.pageSize);
    this.pageSizeChange.emit(this.paginationState.pageSize);
  }

  toggleShowAll(): void {
    this.paginationService.toggleShowAll();
    this.showAllToggle.emit(this.paginationState.showAll);
  }

  getTotalPages(): number {
    return Math.ceil(this.paginationState.totalItems / this.paginationState.pageSize);
  }

  getStartIndex(): number {
    return this.paginationState.currentPage * this.paginationState.pageSize;
  }

  getEndIndex(): number {
    const end = this.getStartIndex() + this.paginationState.pageSize;
    return Math.min(end, this.paginationState.totalItems);
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.paginationState.currentPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and surrounding pages
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add first page if not included
      if (start > 0) {
        pages.unshift(0);
        if (start > 1) {
          pages.splice(1, 0, -1); // -1 indicates ellipsis
        }
      }

      // Add last page if not included
      if (end < totalPages - 1) {
        pages.push(totalPages - 1);
        if (end < totalPages - 2) {
          pages.splice(pages.length - 1, 0, -1); // -1 indicates ellipsis
        }
      }
    }

    return pages;
  }
} 