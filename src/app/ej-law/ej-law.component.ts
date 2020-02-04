import {Component, OnInit} from '@angular/core';
import {EjLawService} from '../ej-law.service';
import {Law} from '../law';

@Component({
    selector: 'app-ej-law',
    templateUrl: './ej-law.component.html',
    styleUrls: ['./ej-law.component.scss']
})
export class EjLawComponent implements OnInit {
    url: string;
    urlDutch: string;
    urlFrench: string;
    doc;
    law: Law;
    lawLoaded: boolean;
    lawLoading: boolean;
    showpreambule = false;
    showCoS = false;
    language = 'nl';

    constructor(private ejLawService: EjLawService) {
        this.url = '';
        this.lawLoaded = false;
    }

    ngOnInit() {
        // adding url as iframe name allows cross domain information passing
        if (window.name.includes('ejustice')) {
            this.url = window.name;
            this.getLaw(this.url);
        }
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
        this.parseUrl(url);
        this.lawLoaded = false;
        this.lawLoading = true;
        this.doc = this.ejLawService.getDoc(url)
            .subscribe((data) => {
                    this.law = this.ejLawService.createLaw(data);
                    this.lawLoaded = true;
                    this.lawLoading = false;
                }
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
