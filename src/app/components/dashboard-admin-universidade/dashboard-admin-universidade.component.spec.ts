import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminUniversidadeDashboardComponent } from './dashboard-admin-universidade.component';

describe('AdminUniversidadeDashboardComponent', () => {
  let component: AdminUniversidadeDashboardComponent;
  let fixture: ComponentFixture<AdminUniversidadeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ AdminUniversidadeDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUniversidadeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 