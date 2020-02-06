import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjLawComponent } from './ej-law.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('EjLawComponent', () => {
  let component: EjLawComponent;
  let fixture: ComponentFixture<EjLawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ EjLawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // todo fix that component requires the ej-law service which requires a HttpClient
    fixture = TestBed.createComponent(EjLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
