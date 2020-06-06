import {Article} from './article';
import {Container, Language} from './container';
import {Observable} from 'rxjs';

const levels = ['book', 'part', 'lawtitle', 'chapter', 'section', 'subsection'];

export function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}


export class Law {
    classId = 'Law';
    DOM: Document;
    originalDOM: Document;
    title: string;
    displayTitle: string;
    dateWorking: Date;
    datePublished: Date;
    date: Date;
    numberId: number;
    dossierNumber: string;
    pageNumber: number;
    source: string;
    bsUrl;
    preambule: string;
    containers: Container[];
    books: Container[];
    lawtitles: Container[];
    chapters: Container[];
    sections: Container[];
    subSections: Container[];
    articles: Article[];
    language: Language;
    law: Container;
    cosUrl: URL;
    archivesUrl: URL;
    implementingDocumentsUrl: URL;

    constructor(DOM$: Observable<Document[]>, language) {
        this.containers = [];
        this.books = [];
        this.lawtitles = [];
        this.chapters = [];
        this.sections = [];
        this.subSections = [];
        DOM$.subscribe(DOM => {
            this.DOM = DOM[0];
            this.originalDOM = DOM[1];
            let dataText = '';
            try {
                dataText = this.DOM.getElementById('Wetstitel').innerText;
                if (this.DOM.getElementById('Wetstitel').querySelector('a')) {
                    this.bsUrl = this.DOM.getElementById('Wetstitel').querySelector('a').href;
                } else {
                    this.bsUrl = 'Todo: url not found for this type of law.';
                }
            } catch (e) {
                if (e instanceof TypeError) {
                    console.warn('Should change using Element because not robust');
                    console.warn(DOM);
                } else {
                    throw e;
                }
            }
            this.title = this.getLawTitle(dataText);
            this.date = this.getLawDate(dataText);
            this.language = language;
            this.displayTitle = this.getDisplayTitle(this.language);
            this.datePublished = this.getLawPublicationDate(dataText);
            this.dateWorking = this.getLawWorkingDate(dataText);
            this.pageNumber = this.getLawPageStart(dataText);
            this.dossierNumber = this.getDossierNumber(dataText);
            this.numberId = this.getNumberId(dataText);
            this.source = this.getSource(dataText);
            this.preambule = this.getPreambule(this.DOM);
            this.cosUrl = this.getCouncilOfState(this.DOM);
            this.implementingDocumentsUrl = this.getImplementingDocuments(this.DOM);
            this.archivesUrl = this.getArchives(this.DOM);
            this.articles = this.parseArticles(this.DOM);
            this.createContainerStructure(this.DOM);
        });
    }

    getHighestLevel(DOM) {
        for (const level of levels) {
            if (DOM.querySelectorAll(level).length > 0) {
                return level;
            }
        }
    }


    addChildren(c: Container) {
        let childContainer;
        for (const child of c.DOM.children) {
            const containerType = child.nodeName.toLowerCase();
            if (levels.includes(containerType)) {
                childContainer = new Container(containerType, child.id, child.title, child, this.language);
                this.addChildren(childContainer);
                c.addChild(childContainer);
            }
            if (containerType === 'article') {
                c.addChild(new Article(child, this.language));
            }
        }
    }

    createContainerStructure(DOM) {
        this.law = new Container('law',  0, '', DOM, this.language);
        for (const element of DOM.querySelectorAll(this.getHighestLevel(DOM))) {
            const c = new Container(element.nodeName.toLowerCase(), element.id, element.title, element, this.language);
            this.addChildren(c);
            this.law.addChild(c);
        }
        if (this.law.children.length === 0) {
            // Some laws have only articles
            for (const article of DOM.querySelectorAll('article')) {
                this.law.addChild(new Article(article, this.language));
            }
        }
    }

    getPreambule(DOM) {
        if (this.language === 'nl') {
            if (DOM.getElementById('Aanhef')) {
                return DOM.getElementById('Aanhef').querySelectorAll('th')[4].innerText;
            }
        } else if (this.language === 'fr') {
            if (DOM.getElementById('Aanhef')) {
                return DOM.getElementById('Aanhef').innerText;
            }
        } else {
            console.warn('No preambule, investigate.');
            return '';
        }
    }

    getDisplayTitle(language) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        let title = this.title;
        if (language === 'fr') {
            // todo check French
            if (this.title.includes('relatif à') || this.title.includes('relative')) {
                title = this.title.replace(/relatif à|relative/, 'du ' + this.date.toLocaleDateString('fr-BE', options) + ' sur');
            }
        }
        if (language === 'nl') {
            if (this.title.includes('betreffende')) {
                title = this.title.replace('betreffende', 'van ' + this.date.toLocaleDateString('nl-BE', options) + ' betreffende');
            }
        }
        return title.match(/(.*?)(\.|\(|$)/gi)[0]
            .replace(/^[^A-Za-z]+/, '')
            .replace(/(\(|\.)$/, '')
    }

    getLawTitle(text) {
        // todo add support for notes in title
        // todo fix ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=nl&la=N&table_name=wet&cn=2017071306
        const title = /^(\d+\s[A-Z]*?\s\d{4})\.\s-\s(.*)/mi.exec(text);
        if (title?.length >= 2) {
            return title[2].replace(/\s*?[\s\.?]$/, '');
        } else {
            console.warn('Failure to get law title');
            return '';
        }
    }

    getLawDate(text) {
        const date = /Dossier.*?(\d{4}-\d{2}-\d{2})/i.exec(text);
        if (date) {
            const dateSplit = date[1].split('-');
            return new Date(parseInt(dateSplit[0], 10), parseInt(dateSplit[1], 10), parseInt(dateSplit[2], 10));
        } else {
            return new Date(0, 0, 0); // todo handle unknown date
        }
    }

    text2date(text) {
        if (text) {
            const dateSplit = text[1].split('-');
            return new Date(parseInt(dateSplit[2], 10), parseInt(dateSplit[1], 10), parseInt(dateSplit[1], 10));
        } else {
            return new Date(0, 0, 0); // todo handle unknown date
        }
    }

    getLawPublicationDate(text) {
        const pubDate = (this.language === 'fr') ? 'Publication' : 'Publicatie';
        const datePublished = new RegExp(pubDate + '.*?(\\d{2}-\\d{2}-\\d{4})', 'i').exec(text);
        return this.text2date(datePublished);
    }

    getLawWorkingDate(text) {
        const wDate = (this.language === 'fr') ? 'Entrée en vigueur ' : 'Inwerkingtreding';
        const dateWorking = new RegExp(wDate + '.*?(\\d{2}-\\d{2}-\\d{4})', 'i').exec(text);
        return this.text2date(dateWorking);
    }

    getLawPageStart(text) {
        const page = (this.language === 'fr') ? 'page' : 'bladzijde';
        const pageStart = new RegExp(page + '.*?(\\d{1,7})', 'i').exec(text);
        if (pageStart) {
            return parseInt(pageStart[1], 10);
        } else {
            return 0; // todo handle error
        }
    }

    getDossierNumber(text) {
        const dossierNumber = /Dossier.:.*?(\d.*)/mi.exec(text);
        if (dossierNumber) {
            return dossierNumber[1];
        } else {
            return ''; // todo handle error
        }
    }

    getNumberId(text) {
        const numberId = /num.*?:.*?(\d{10})/mi.exec(text);
        if (numberId) {
            return parseInt(numberId[1], 10);
        } else {
            return 0; // todo handle error
        }
    }

    getSource(text) {
        const source = /(bron|Source).:(.*)/mi.exec(text);
        if (source) {
            return strip(source[2]);
        } else {
            return '';
        }
    }

    // search for highest first, add if exists, then go depth first
    parseArticles(DOM: Document) {
        const articles: Article[] = [];
        const articlesDom = DOM.querySelectorAll('article');
        for (let articleIndex = 0; articleIndex < articlesDom.length; articleIndex++) {
            articles[articleIndex] = new Article(articlesDom[articleIndex], this.language);
        }
        return articles;
    }

    getCouncilOfState(DOM): URL {
        const cosId = (this.language === 'fr') ? 'Conseild\'Etat' : 'RaadvanState';
        const div = DOM.getElementById(cosId);
        if (div) {
            return new URL(div.children[0].href);
        }
    }

    getArchives(DOM): URL {
        const archiveId = (this.language === 'fr') ? 'versionsarchivées' : 'gearchiveerdeversies';
        const div = DOM.getElementById(archiveId);
        if (div) {
            const urlHref = div.children[0].href.replace(
                /((https?|moz|unsafe:moz-extension):\/\/.*?\/|^\/)/,
                'https://www.ejustice.just.fgov.be/');
            return new URL(urlHref);
        }
    }


    getImplementingDocuments(DOM): URL {
        const implementingDocId = (this.language === 'fr') ? 'arrêtésd\'exécution' : 'uitvoeringbesluiten';
        const div = DOM.getElementById(implementingDocId);
        if (div) {
            const urlHref = div.children[0].href.replace(
                /((https?|moz|unsafe:moz-extension):\/\/.*?\/|^\/)/,
                'https://www.ejustice.just.fgov.be/');
            return new URL(urlHref);
        }
    }

    get originalHTML () {
        let doc = this.originalDOM.querySelector('body').innerHTML;
        doc = doc.replace(/href="?\//gi, 'href="https://www.ejustice.just.fgov.be/')
        return doc
    }
}
