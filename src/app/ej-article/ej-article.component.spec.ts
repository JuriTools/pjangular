import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjArticleComponent } from './ej-article.component';

describe('EjArticleComponent', () => {
  let component: EjArticleComponent;
  let fixture: ComponentFixture<EjArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
