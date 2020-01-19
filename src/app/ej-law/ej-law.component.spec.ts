import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjLawComponent } from './ej-law.component';

describe('EjLawComponent', () => {
  let component: EjLawComponent;
  let fixture: ComponentFixture<EjLawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjLawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
