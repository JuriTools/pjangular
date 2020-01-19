import {Article} from './article';

export function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

class Container {
    type;
    parent;
    children;
    id;

    constructor(type, parent, id = 0) {
        this.type = type;
        this.parent = parent || undefined;
        this.id = id || 0;
        this.children = [];
    }

    next() {
        return this;
    }

    addChild(child) {
        this.children.push(child);
    }

    removeChildrenByType(type) {
        console.log('remove children of type: ' + type);
        for (let i = 0; i < this.children.length; i++) {
            console.log(this.children[i].type + '  ' + type);
            if (this.children[i].type === type) {
                this.children.splice(i, 1);
            } else if (this.children[i].children) {
                for (let j = 0; j < this.children[i].children.length; j++) {
                    if (this.children[i].children[j].type === type) {
                        this.children[i].children.splice(j, 1);
                    }
                }
            }

        }
    }
}

export class Law {
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
    books: Container[];
    titles: Container[];
    chapters: Container[];
    sections: Container[];
    subSections: Container[];
    articles: Article[];
    language: string;
    law: Container;
    cosUrl: string;
    archivesUrl: string;
    implementingDocumentsUrl: string;

    constructor(DOM, language) {

        this.books = [];
        this.titles = [];
        this.chapters = [];
        this.sections = [];
        this.subSections = [];
        console.log(DOM);
        const dataText = DOM.getElementById('Wetstitel').innerText;
        this.bsUrl = DOM.getElementById('Wetstitel').querySelector('a').href;
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
        this.setStructure();
        // console.log(this);
    }

    getItems(type: string, parent: Container) {
        let items = [];

        for (let i = 0; i < this.articles.length; i++) {
            items.push(this.articles[i][type]);
        }
        const setItems = Array.from(new Set(items));
        items = [];
        for (let i = 0; i < setItems.length; i++) {
            const item = new Container(type, parent, setItems[i]);
            items.push(item);
            if (parent) {
                parent.addChild(item);
            }
        }
        return items;
    }

    setStructure() {
        let parent;
        this.law = new Container('law', undefined, 0);
        this.books = this.getItems('book', this.law);
        for (let i = 0; i < this.books.length; i++) {
            if (this.books.length === 1) {
                parent = this.law;
                this.law.removeChildrenByType('book');
            } else {
                parent = this.books[i];
            }
            this.titles = this.getItems('title', parent);
            for (let j = 0; j < this.titles.length; j++) {
                if (this.titles.length === 1) {
                    parent = this.law; // There are no books without title, I think.
                    this.law.removeChildrenByType('title');
                } else {
                    parent = this.titles[i];
                }
                this.chapters = this.getItems('chapter', parent);
                for (let k = 0; k < this.chapters.length; k++) {
                    if (this.chapters.length === 1) {
                        parent = this.law;
                        this.law.removeChildrenByType('section');
                    } else {
                        parent = this.chapters[k];
                    }
                    this.sections = this.getItems('section', parent);
                    for (let l = 0; l < this.sections.length; l++) {
                        if (this.sections.length === 1) {
                            parent = this.chapters[k];
                            this.law.removeChildrenByType('section');
                        } else {
                            parent = this.sections[l];
                        }
                        this.subSections = this.getItems('subsection', parent);
                        for (let m = 0; m < this.subSections.length; m++) {
                            if (this.subSections.length === 1) {
                                parent = this.chapters[k];
                                this.law.removeChildrenByType('subsection');
                            } else {
                                parent = this.subSections[m];
                            }
                            for (let n = 0; n < this.articles.length; n++) {
                                if (this.books[i].id === this.articles[n].book &&
                                    this.titles[j].id === this.articles[n].title &&
                                    this.chapters[k].id === this.articles[n].chapter &&
                                    this.sections[l].id === this.articles[n].section &&
                                    this.subSections[m].id === this.articles[n].subSection) {
                                    parent.addChild(this.articles[n]);
                                }
                            }
                        }
                    }
                }
            }
            // Todo skip 0 nodes by relinking parent & child at end of for loop
        }
        console.log(this.law);

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
            return this.title.replace(/relatif à|relative/, 'du ' + this.date.toLocaleDateString('fr-BE', options) + ' sur');
        }
        if (language === 'nl') {
            return this.title.replace('betreffende', 'van ' + this.date.toLocaleDateString('nl-BE', options) + ' betreffende');
        }
    }

    getLawTitle(text) {
        const title = /^(\d+\s[A-Z]*?\s\d{4})\.\s-\s(.*)/mi.exec(text);
        console.log(text);
        console.log(title);
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

    getLawPublicationDate(text) {
        const pubDate = (this.language === 'fr') ? 'Publication' : 'Publicatie';
        const datePublished = new RegExp(pubDate + '.*?(\\d{2}-\\d{2}-\\d{4})', 'i').exec(text);
        if (datePublished) {
            const dateSplit = datePublished[1].split('-');
            return new Date(parseInt(dateSplit[2], 10), parseInt(dateSplit[1], 10), parseInt(dateSplit[1], 10));
        } else {
            return new Date(0, 0, 0); // todo handle unknown date
        }
    }

    getLawWorkingDate(text) {
        const wDate = (this.language === 'fr') ? 'Entrée en vigueur ' : 'Inwerkingtreding';
        const dateWorking = new RegExp(wDate + '.*?(\\d{2}-\\d{2}-\\d{4})', 'i').exec(text);
        if (dateWorking) {
            const dateSplit = dateWorking[1].split('-');
            return new Date(parseInt(dateSplit[2], 10), parseInt(dateSplit[1], 10), parseInt(dateSplit[1], 10));
        } else {
            return new Date(0, 0, 0); // todo handle unknown date
        }
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
