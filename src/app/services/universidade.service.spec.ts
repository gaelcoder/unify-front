import { TestBed } from '@angular/core/testing';

import { UniversidadeService } from './universidade.service';

describe('UniversidadeService', () => {
  let service: UniversidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversidadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
