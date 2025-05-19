import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversidadeFormComponent } from './universidade-form.component';

describe('UniversidadeFormComponent', () => {
  let component: UniversidadeFormComponent;
  let fixture: ComponentFixture<UniversidadeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversidadeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversidadeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
