import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesSecretariaListComponent } from './solicitacoes-secretaria-list.component';

describe('SolicitacoesSecretariaListComponent', () => {
  let component: SolicitacoesSecretariaListComponent;
  let fixture: ComponentFixture<SolicitacoesSecretariaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacoesSecretariaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesSecretariaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
