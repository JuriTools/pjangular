import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjContainerComponent } from './ej-container.component';

describe('EjContainerComponent', () => {
  let component: EjContainerComponent;
  let fixture: ComponentFixture<EjContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
