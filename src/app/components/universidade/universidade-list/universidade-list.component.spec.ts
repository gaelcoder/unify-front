import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversidadeListComponent } from './universidade-list.component';

describe('UniversidadeListComponent', () => {
  let component: UniversidadeListComponent;
  let fixture: ComponentFixture<UniversidadeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversidadeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversidadeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
