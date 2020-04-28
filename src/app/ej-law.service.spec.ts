import {TestBed} from '@angular/core/testing';

import {EjLawService} from './ej-law.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('EjLawService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EjLawService]
        });
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });

    it('should be created', () => {
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service).toBeTruthy();
    });

    it('should have getData function', () => {
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.getLaw).toBeTruthy();
    });

    it('should parse valid French ELI url', () => {
        const url = new URL('http://www.ejustice.just.fgov.be/eli/decret/2018/05/11/2018202651/justel');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.parseUrl(url)).toEqual({
            nl: new URL('http://www.ejustice.just.fgov.be/eli/decreet/2018/05/11/2018202651/justel'),
            fr: new URL('http://www.ejustice.just.fgov.be/eli/decret/2018/05/11/2018202651/justel')
        });
    });
    it('should parse valid Dutch ELI url', () => {
        const url = new URL('https://www.ejustice.just.fgov.be/eli/wet/1867/06/08/1867060850/justel');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.parseUrl(url)).toEqual({
            nl: new URL('https://www.ejustice.just.fgov.be/eli/wet/1867/06/08/1867060850/justel'),
            fr: new URL('https://www.ejustice.just.fgov.be/eli/loi/1867/06/08/1867060850/justel'),
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
    // todo check why test does not fail
    it('should parse Archived url', () => {
        const url = new URL('https://www.ejustice.just.fgov.be/cgi_loi/arch_a.pl?sql=(text+contains+(%27%27))&rech=1&language=fr&tri=dd+AS+RANK&numero=1&table_name=loi&cn=1867060801&caller=archive&fromtab=loi&la=F&ver_arch=140');
        const service: EjLawService = TestBed.inject(EjLawService);
        expect(service.parseUrl(url)).toEqual({
            nl: new URL('https://www.ejustice.just.fgov.be/cgi_loi/loi_a1.pl?language=nl&la=N&cn=1867060801&table_name=wet&&caller=archive&N&fromtab=wet&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))'),
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

    it('should have Council of State url', (done: DoneFn) => {
        const service: EjLawService = TestBed.inject(EjLawService);
        const law$ = service.getLaw(
            new URL('https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=nl&la=N&cn=1867060801&table_name=wet'),
            'nl');
        law$.subscribe(law => {
            expect(law.cosUrl).toEqual(new URL('http://reflex.raadvst-consetat.be/reflex/?page=chrono&c=detail_get&d=detail&docid=48299&tab=chrono'));
            done();
        });
    });
    it('should get Archived version', (done: DoneFn) => {
        const service: EjLawService = TestBed.inject(EjLawService);
        const law$ = service.getLaw(
            new URL('https://www.ejustice.just.fgov.be/cgi_loi/arch_a.pl?sql=(text+contains+(%27%27))&rech=1&language=fr&tri=dd+AS+RANK&numero=1&table_name=loi&cn=1867060801&caller=archive&fromtab=loi&la=F&ver_arch=140'),
            'nl');
        law$.subscribe(law => {
            expect(law.cosUrl).toEqual(new URL('http://reflex.raadvst-consetat.be/reflex/?page=chrono&c=detail_get&d=detail&docid=48299&tab=chrono'));
            done();
        });
    });
    it('should get correct Title', (done: DoneFn) => {
        const service: EjLawService = TestBed.inject(EjLawService);
        const law$ = service.getLaw(
            new URL('https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=nl&la=N&table_name=wet&cn=2016020511'), 'nl');
        law$.subscribe(law => {
            expect(law.title).toEqual('Wet tot wijziging van het strafrecht en de strafvordering en houdende diverse bepalingen inzake justitie(NOTA : Raadpleging van vroegere versies vanaf 19-02-2016 en tekstbijwerking tot 30-05-2018)');
            done();
        });
    });
});
