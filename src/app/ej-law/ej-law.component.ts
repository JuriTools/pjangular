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

    getLaw(url) {
        this.lawLoaded = false;
        this.lawLoading = true;
        this.doc = this.ejLawService.getDoc(url)
            .subscribe((data) => {
                    this.law = this.ejLawService.createLaw(data);
                    this.lawLoaded = true;
                    this.lawLoading = false;
                    const urls = this.ejLawService.getUrls();
                    this.urlDutch = urls.nl;
                    this.urlFrench = urls.fr;
                }
            );
    }

    switchLawLanguage() {
        if (this.language === 'nl') {
            this.language = 'fr';
            this.ejLawService.setlanguage('fr');
            this.getLaw(this.urlFrench);
        } else if (this.language === 'fr') {
            this.language = 'nl';
            this.ejLawService.setlanguage('nl');
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
