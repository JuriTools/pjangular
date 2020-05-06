import {Component, OnInit} from '@angular/core';
import {EjLawService} from '../ej-law.service';
import {Law} from '../law';
import {Language} from '../container';


@Component({
    selector: 'app-ej-law',
    templateUrl: './ej-law.component.html',
    styleUrls: ['./ej-law.component.scss']
})
export class EjLawComponent implements OnInit {
    url: URL;
    law: Law;
    lawLoaded: boolean;
    lawLoading: boolean;
    languageLoaded: boolean;
    switchingLanguage: boolean;
    language: Language;
    originalLaw: boolean;

    constructor(private ejLawService: EjLawService) {
        // this.language = 'nl';
        this.lawLoaded = false;
        this.languageLoaded = false;
        this.switchingLanguage = false;
        this.originalLaw = false;
    }

    ngOnInit() {
        // adding url as iframe name allows cross domain information passing
        if (window.name.includes('ejustice')) {
            this.url = new URL(window.name);
            this.getLaw(this.url.href);
        }
    }

    getLaw(url: string, language?: Language) {
        this.lawLoaded = false;
        this.lawLoading = true;
        this.url = new URL(url);
        // url.href = url?.href.replace(/.*?4200/, 'http://www.ejustice.just.fgov.be');
        this.ejLawService.getLaw(this.url, language)
            .subscribe(
                data => {
                    this.language = this.ejLawService.getLanguage(this.url);
                    this.law = data;
                    this.lawLoaded = true;
                    this.lawLoading = false;
                    this.languageLoaded = true;
                    this.switchingLanguage = false;
                },
                error => {
                    console.error(`Error in getting law: ${error}`);
                    this.lawLoading = false;
                    this.ejLawService.getOriginalLaw(this.url, language).subscribe(data =>
                        document.write(data)
                    );
                });
    }


    switchLawLanguage() {
        const urls = this.ejLawService.getURLs();
        this.language = this.language === 'nl' ? 'fr' : 'nl';
        // todo change setting language here
        this.switchingLanguage = true;
        this.getLaw(urls[this.language].href, this.language);
    }

    showOriginalLaw() {
        this.originalLaw = !this.originalLaw;
    }
}
