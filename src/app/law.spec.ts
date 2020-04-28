import {Law} from './law';
import {EjLawService} from './ej-law.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Law', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EjLawService]
        });
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    it('should create an instance', () => {
        // expect(new Law()).toBeTruthy();
    });
    it('should get Implementing Document url', () => {
        const url = new URL('http://www.ejustice.just.fgov.be/eli/grondwet/1994/02/17/1994021048/justel');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(() =>
            service.getLaw(url).subscribe(law => {
                    expect(law.implementingDocumentsUrl).toEqual(new URL('http://www.ejustice.just.fgov.be/cgi_loi/loi_l.pl?sql=arrexec+contains+%271994021730%27+and+la+=+%27N%27&rech=11380&language=nl&tri=dd+AS+RANK&numero=1&table_name=wet&cn=1994021730&caller=arrexec&fromtab=wet&la=N&cn_arrexec=1994021730&dt_arrexec=GRONDWET+1994'));
                }
            )
        ).toThrowError('Unknown ELI url variant');
    });
});

