import { TestBed } from '@angular/core/testing';

import { EjLawService } from './ej-law.service';

describe('EjLawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EjLawService = TestBed.get(EjLawService);
    expect(service).toBeTruthy();
  });
});
