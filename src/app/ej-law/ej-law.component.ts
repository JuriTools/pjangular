import {Component, OnInit} from '@angular/core';
import {EjLawService} from '../ej-law.service';
import {Law} from '../law';
import {Language} from '../container';
import {Observable} from 'rxjs';


@Component({
    selector: 'app-ej-law',
    templateUrl: './ej-law.component.html',
    styleUrls: ['./ej-law.component.scss']
})
export class EjLawComponent implements OnInit {
    url: URL;
    law: Law;
    law$: Observable<Law>;
    lawLoaded: boolean;
    lawLoading: boolean;
    languageLoaded: boolean;
    showCoS: boolean;
    switchingLanguage: boolean;
    language: Language;


    constructor(private ejLawService: EjLawService) {
        // this.language = 'nl';
        this.lawLoaded = false;
        this.languageLoaded = false;
        this.switchingLanguage = false;
    }

    ngOnInit() {
        // adding url as iframe name allows cross domain information passing
        if (window.name.includes('ejustice')) {
            this.url = new URL(window.name);
            this.getLaw(this.url);
        }
    }

    getLaw(urlHref, language?: Language) {
        this.lawLoaded = false;
        this.lawLoading = true;
        this.url = new URL(urlHref);
        this.ejLawService.getLaw(this.url, language).subscribe(data => {
            this.law = data;
            this.language = this.ejLawService.getLanguage(this.url);
            this.lawLoaded = true;
            this.lawLoading = false;
            this.languageLoaded = true;
            this.switchingLanguage = false;
        });
    }

    switchLawLanguage(language: Language) {
        const urls = this.ejLawService.getURLs();
        this.language = language === 'nl' ? 'fr' : 'nl';
        // todo change setting language here
        this.switchingLanguage = true;
        this.getLaw(urls[this.language], this.language);
    }


    showImplementingDocuments() {

    }

    showArchivedVersions() {

    }

    showCouncilOfState() {
        if (this.law.cosUrl) {
            this.showCoS = !this.showCoS;
            console.log('Preambule: ' + this.showCoS);
        }
    }

}
