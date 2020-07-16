import {Component, OnInit} from '@angular/core';
// import {EjLawService} from '../ej-law.service';
import {EjusticeLibService, Law, Language} from 'ejustice-lib';
import {EjPdfService} from '../ej-pdf.service';
import {of} from 'rxjs';


@Component({
    selector: 'app-ej-law',
    templateUrl: './ej-law.component.html',
    styleUrls: ['./ej-law.component.scss'],
    providers: [
        EjusticeLibService
    ]
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
    pdfGenerating: boolean;

    constructor(private ejLawService: EjusticeLibService,
                private ejPdfService: EjPdfService) {
        // this.language = 'nl';
        this.lawLoaded = false;
        this.languageLoaded = false;
        this.switchingLanguage = false;
        this.originalLaw = false;
        this.pdfGenerating = false;
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
                    // Check if there are articles in the law, otherwise show the original content
                    if (this.law.law.children.length === 0) {
                        this.originalLaw = true;
                    }
                },
                error => {
                    console.error(`Error in getting law: ${error}`);
                    this.lawLoading = false;
                    this.ejLawService.getOriginalLaw(this.url, language).subscribe(data =>
                        document.write(data)
                    );
                });
    }

    getPdf() {
        // todo generate json from law
        const bundle = {
            lawName: this.law.displayTitle,
            lawDate: this.law.datePublished,
            lawAbbreviation: '',
            lawURL: this.ejLawService.urls.nl,
            lawArticles: '*'
        };
        this.pdfGenerating = true;
        this.ejPdfService.postJson(bundle)
            .subscribe(data => {
                    const pdfBlob = new Blob([data], {type: 'application/pdf'});
                    const url = window.URL.createObjectURL(pdfBlob);
                    window.open(url);
                    this.pdfGenerating = false;
                }
            );
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
