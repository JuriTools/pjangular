import { TestBed} from '@angular/core/testing';

import {EjLawService} from './ej-law.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('EjLawService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EjLawService]
        });
    });

    it('should be created', () => {
        const service: EjLawService = TestBed.get(EjLawService);
        expect(service).toBeTruthy();
    });

    it('should have getData function', () => {
        const service: EjLawService = TestBed.get(EjLawService);
        expect(service.getDoc).toBeTruthy();
    });
});
