import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentanteListComponent } from './representante-list.component';

describe('RepresentanteListComponent', () => {
  let component: RepresentanteListComponent;
  let fixture: ComponentFixture<RepresentanteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentanteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepresentanteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
