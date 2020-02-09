import {Component, OnInit} from '@angular/core';
import {EjLawService} from '../ej-law.service';
import {Law, Language} from '../law';
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
    showpreambule = false;
    language: Language;


    constructor(private ejLawService: EjLawService) {
        this.language = 'nl';
        this.lawLoaded = false;
        this.languageLoaded = false;
    }

    ngOnInit() {
        // adding url as iframe name allows cross domain information passing
        if (window.name.includes('ejustice')) {
            this.url = new URL(window.name);
            this.getLaw(this.url);
        }
    }

    getLaw(urlHref, language?: 'nl' | 'fr') {
        this.lawLoaded = false;
        this.lawLoading = true;
        this.url = new URL(urlHref);
        this.ejLawService.getLaw(this.url, language).subscribe(data => {
            this.law = data;
            this.language = this.ejLawService.getLanguage(this.url);
            this.lawLoaded = true;
            this.lawLoading = false;
            this.languageLoaded = true;
        });
    }

    switchLawLanguage() {
        const urls = this.ejLawService.getURLs();
        this.language = this.language === 'nl' ? 'fr' : 'nl';
        this.getLaw(urls[this.language], this.language);
    }


    showPreambule() {
        this.law$.subscribe(law => {
            this.law.preambule = law.preambule;
            this.showpreambule = this.showpreambule ? !this.showpreambule : this.showpreambule;
        });
    }
}
