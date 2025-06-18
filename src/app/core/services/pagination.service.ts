import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions: number[];
  showFirstLastButtons: boolean;
  showAllOption: boolean;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  showAll: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private paginationState = new BehaviorSubject<PaginationState>({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    showAll: false
  });

  private defaultConfig: PaginationConfig = {
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true,
    showAllOption: true
  };

  constructor() {}

  getPaginationState(): Observable<PaginationState> {
    return this.paginationState.asObservable();
  }

  getCurrentState(): PaginationState {
    return this.paginationState.value;
  }

  setPage(page: number): void {
    const currentState = this.paginationState.value;
    this.paginationState.next({
      ...currentState,
      currentPage: page
    });
  }

  setPageSize(pageSize: number): void {
    const currentState = this.paginationState.value;
    this.paginationState.next({
      ...currentState,
      pageSize,
      currentPage: 0 // Reset to first page when changing page size
    });
  }

  setTotalItems(totalItems: number): void {
    const currentState = this.paginationState.value;
    this.paginationState.next({
      ...currentState,
      totalItems
    });
  }

  toggleShowAll(): void {
    const currentState = this.paginationState.value;
    this.paginationState.next({
      ...currentState,
      showAll: !currentState.showAll,
      currentPage: 0
    });
  }

  getPaginatedData<T>(data: T[]): T[] {
    const state = this.paginationState.value;
    
    if (state.showAll) {
      return data;
    }

    const startIndex = state.currentPage * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return data.slice(startIndex, endIndex);
  }

  getDefaultConfig(): PaginationConfig {
    return { ...this.defaultConfig };
  }

  resetPagination(): void {
    this.paginationState.next({
      currentPage: 0,
      pageSize: 10,
      totalItems: 0,
      showAll: false
    });
  }
} 