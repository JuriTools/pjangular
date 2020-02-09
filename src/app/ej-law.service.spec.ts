import {TestBed} from '@angular/core/testing';

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
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service).toBeTruthy();
    });

    it('should have getData function', () => {
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.getDoc).toBeTruthy();
    });

    it('should parse valid French ELI url', () => {
        const url = new URL('http://www.ejustice.just.fgov.be/eli/decret/2018/05/11/2018202651/justel');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.parseUrl(url)).toEqual({
            nl: 'http://www.ejustice.just.fgov.be/eli/decreet/2018/05/11/2018202651/justel',
            fr: 'http://www.ejustice.just.fgov.be/eli/decret/2018/05/11/2018202651/justel'
        });
    });
    it('should parse valid Dutch ELI url', () => {
        const url = new URL('https://www.ejustice.just.fgov.be/eli/wet/1867/06/08/1867060850/justel');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.parseUrl(url)).toEqual({
            nl: 'https://www.ejustice.just.fgov.be/eli/wet/1867/06/08/1867060850/justel',
            fr: 'https://www.ejustice.just.fgov.be/eli/loi/1867/06/08/1867060850/justel',
        });
    });
    it('should parse valid French frame url', () => {
        const url = new URL('https://www.ejustice.just.fgov.be/cgi_loi/loi_a1.pl?language=fr&la=F&cn=1867060801&table_name=loi&&caller=list&F&fromtab=loi&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.parseUrl(url)).toEqual({
            nl: new URL('https://www.ejustice.just.fgov.be/cgi_loi/loi_a1.pl?language=nl&la=N&cn=1867060801&table_name=wet&&caller=list&N&fromtab=wet&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))'),
            fr: new URL('https://www.ejustice.just.fgov.be/cgi_loi/loi_a1.pl?language=fr&la=F&cn=1867060801&table_name=loi&&caller=list&F&fromtab=loi&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))'),
        });
    });
    it('should parse valid French non-frame url', () => {
        const url = new URL('https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1867060801&table_name=loi');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.parseUrl(url)).toEqual({
            nl: new URL('https://www.ejustice.just.fgov.be/cgi_loi/loi_a1.pl?language=nl&la=N&cn=1867060801&table_name=wet&&caller=list&N&fromtab=wet&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))'),
            fr: new URL('https://www.ejustice.just.fgov.be/cgi_loi/loi_a1.pl?language=fr&la=F&cn=1867060801&table_name=loi&&caller=list&F&fromtab=loi&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))'),
        });
    });
    it('should fail on invalid url', () => {
        const url = new URL('https://www.ejuste.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1867');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(() =>
            service.parseUrl(url)
        ).toThrowError('Invalid URL');
    });
    it('should fail on invalid ELI url', () => {
        const url = new URL('https://www.ejustice.just.fgov.be/eli/INVALID/1867/06/08/1867060850/justel');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(() =>
            service.parseUrl(url)
        ).toThrowError('Unknown ELI url variant');
    });
});
