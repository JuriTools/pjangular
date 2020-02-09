import {Article} from './article';

export type Language = 'nl' | 'fr';

export function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

export class Container {
    classId = 'Container';
    type: string;
    typeLabel: string;
    parent: Container;
    children;
    id: number;
    title: string;
    DOM;

    constructor(type, parent, id = 0, title, DOM) {
        this.type = type;
        this.typeLabel = this.getTypeLabel(type);
        this.parent = parent || undefined;
        this.id = id || 0;
        this.children = [];
        this.title = title;
        this.DOM = DOM;
    }

    // todo: add french, move to translation files
    getTypeLabel(type) {
        const labels = {
            book: 'Boek',
            lawtitle: 'Titel',
            chapter: 'Hoofdstuk',
            section: 'Afdeling',
            subsection: 'Onderafdeling'
        };
        return labels[type];
    }

    next() {
        return this;
    }

    addChild(child) {
        this.children.push(child);
    }
}

export class Law {
    classId = 'Law';
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
    language: string;
    law: Container;
    cosUrl: string;
    archivesUrl: string;
    implementingDocumentsUrl: string;

    constructor(DOM: Document, language) {
        this.containers = [];
        this.books = [];
        this.lawtitles = [];
        this.chapters = [];
        this.sections = [];
        this.subSections = [];
        console.log(DOM);
        const dataText = DOM.getElementById('Wetstitel').innerText;
        if (DOM.getElementById('Wetstitel').querySelector('a')) {
            this.bsUrl = DOM.getElementById('Wetstitel').querySelector('a').href;
        } else {
            this.bsUrl = 'Todo: url not found for this type of law.';
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
        this.preambule = this.getPreambule(DOM);
        this.cosUrl = this.getCouncilOfState(DOM);
        this.implementingDocumentsUrl = this.getImplementingDocuments(DOM);
        this.archivesUrl = this.getArchives(DOM);
        this.articles = this.parseArticles(DOM);
        this.createContainerStructure(DOM);
    }

    getHighestLevel(DOM, levels) {
        for (const level of levels) {
            if (DOM.querySelectorAll(level).length > 0) {
                return level;
            }
        }
    }

    addChildren(c: Container) {
        const levels = ['book', 'lawtitle', 'chapter', 'section', 'subsection'];
        let childContainer;
        for (const child of c.DOM.children) {
            const containerType = child.nodeName.toLowerCase();
            if (levels.includes(containerType)) {
                childContainer = new Container(containerType, c, child.id, child.title, child);
                this.addChildren(childContainer);
                c.addChild(childContainer);
            }
            if (containerType === 'article') {
                c.addChild(new Article(child));
            }
        }
    }

    createContainerStructure(DOM) {
        this.law = new Container('law', undefined, 0, '', DOM);
        const levels = ['book', 'lawtitle', 'chapter', 'section', 'subsection'];
        for (const element of DOM.querySelectorAll(this.getHighestLevel(DOM, levels))) {
            const c = new Container(element.nodeName.toLowerCase(), this.law, element.id, element.title, element);
            this.addChildren(c);
            this.law.addChild(c);
        }
        if (this.law.children.length === 0) {
            // Some laws have only articles
            for (const article of DOM.querySelectorAll('article')) {
                this.law.addChild(new Article(article));
            }
        }
    }

    getPreambule(DOM) {
        if (this.language === 'nl') {
            if (DOM.getElementById('Aanhef')) {
                console.log(DOM.getElementById('Aanhef').querySelectorAll('th'));
                return DOM.getElementById('Aanhef').querySelectorAll('th')[4].innerText;
            }
        } else if (this.language === 'fr') {
            if (DOM.getElementById('Aanhef')) {
                console.log(DOM.getElementById('Aanhef').querySelectorAll('th'));
                return DOM.getElementById('Aanhef').innerText;
            }
        } else {
            console.log('No preambule, investigate.');
            return '';
        }
    }

    getDisplayTitle(language) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        if (language === 'fr') {
            // todo check French
            if (this.title.includes('relatif à') || this.title.includes('relative')) {
                return this.title.replace(/relatif à|relative/, 'du ' + this.date.toLocaleDateString('fr-BE', options) + ' sur');
            } else {
                return this.title;
            }
        }
        if (language === 'nl') {
            if (this.title.includes('betreffende')) {
                return this.title.replace('betreffende', 'van ' + this.date.toLocaleDateString('nl-BE', options) + ' betreffende');
            } else {
                return this.title;
            }
        }
    }

    getLawTitle(text) {
        const title = /^(\d+\s[A-Z]*?\s\d{4})\.\s-\s(.*)/mi.exec(text);
        // console.log(text);
        // console.log(title);
        return title[2];
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
    parseArticles(DOM) {
        const articles: Article[] = [];
        const articlesDom = DOM.querySelectorAll('article');
        // console.log(articlesDom);
        for (let articleIndex = 0; articleIndex < articlesDom.length; articleIndex++) {
            articles[articleIndex] = new Article(articlesDom[articleIndex]);
        }
        // console.log(articles);
        return articles;
    }

    getCouncilOfState(DOM) {
        const cosId = (this.language === 'fr') ? 'Conseild\'Etat' : 'RaadvanState';
        const div = DOM.getElementById(cosId);
        if (div) {
            return div.children[0].href;
        }
    }

    getArchives(DOM) {
        const archiveId = (this.language === 'fr') ? 'versionsarchivées' : 'gearchiveerdeversies';
        const div = DOM.getElementById(archiveId);
        if (div) {
            return div.children[0].href;
        }
    }


    getImplementingDocuments(DOM) {
        const implementingDocId = (this.language === 'fr') ? 'arrêtésd\'exécution' : 'uitvoeringbesluiten';
        const div = DOM.getElementById(implementingDocId);
        if (div) {
            return div.children[0].href;

        }
    }
}
