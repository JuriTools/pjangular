import {Component, OnInit} from '@angular/core';
import {EjLawService} from '../ej-law.service';
import {Law} from '../law';

@Component({
    selector: 'app-ej-law',
    templateUrl: './ej-law.component.html',
    styleUrls: ['./ej-law.component.css']
})
export class EjLawComponent implements OnInit {
    url: string;
    urlDutch: string;
    urlFrench: string;
    doc;
    law: Law;
    showpreambule = false;
    showCoS = false;
    language = 'nl';

    constructor(private ejLawService: EjLawService) {
    }

    ngOnInit() {
    }

    parseUrl(url) {
        this.url = url;
        // todo switches language based on url, should be more generic
        if (url.includes('language=fr&la=F')) {
            this.urlFrench = url;
            this.language = 'fr';
            url = url.replace('language=fr&la=F', 'language=nl&la=N');
            url = url.replace('&F&', '&N&');
            url = url.replace('table_name=loi', 'table_name=wet');
            this.urlDutch = url;
        } else if (url.includes('language=nl&la=N')) {
            this.urlDutch = url;
            this.language = 'nl';
            url = url.replace('language=nl&la=N', 'language=fr&la=F');
            url = url.replace('&N&', '&F&');
            url = url.replace('table_name=wet', 'table_name=loi');
            this.urlFrench = url;
        }
    }

    getLaw(url) {
        console.log(url);
        this.parseUrl(url);
        this.doc = this.ejLawService.getDoc(url)
            .subscribe((data) =>
                this.law = this.ejLawService.createLaw(data)
            );
    }

    switchLawLanguage() {
        if (this.language === 'nl') {
            this.language = 'fr';
            this.getLaw(this.urlFrench);
        } else if (this.language === 'fr') {
            this.language = 'nl';
            this.getLaw(this.urlDutch);
        }
    }


    showPreambule() {
        console.log(this.law.preambule);
        if (this.law.preambule) {
            this.showpreambule = !this.showpreambule;
            console.log('Preambule: ' + this.showpreambule);
        }
    }

    showImplementingDocuments() {

    }

    showArchivedVersions() {

    }

    showCouncilOfState() {
        console.log(this.law.cosUrl);
        if (this.law.cosUrl) {
            this.showCoS = !this.showCoS;
            console.log('Preambule: ' + this.showCoS);
        }
    }

}
