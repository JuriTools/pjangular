import { TestBed } from '@angular/core/testing';

import { EjPdfService } from './ej-pdf.service';

describe('EjPdfServiceService', () => {
  let service: EjPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
