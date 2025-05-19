import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentanteFormComponent } from './representante-form.component';

describe('RepresentanteFormComponent', () => {
  let component: RepresentanteFormComponent;
  let fixture: ComponentFixture<RepresentanteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentanteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepresentanteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
