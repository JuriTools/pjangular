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

    addNewChild(child) {
        // Only add if child not already existing
        for (const currentChild of this.children) {
            if (child.id === currentChild.id) {
                return;
            }
        }
        this.addChild(child);
    }

    removeChildrenByType(type) {
        // console.log('remove children of type: ' + type);
        for (let i = 0; i < this.children.length; i++) {
            // console.log(this.children[i].type + '  ' + type);
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
        this.setStructure();
        // console.log(this);
    }

    getItems(type: string, parent = this.law) {
        let items = [];

        for (const article of this.articles) {
            if (article[parent.type] === parent.id || parent.type === 'law') {
                items.push(article[type]);
            }
        }
        const setItems = Array.from(new Set(items));
        items = [];
        for (const setItem of setItems) {
            const item = new Container(type, parent, setItem);
            items.push(item);
        }
        return items;
    }

    getChildExists(parent: Container, type: string, id: number) {
        for (const child of parent.children) {
            if (child.type === type && child.id === id) {
                return true;
            }
        }
        return false;
    }

    setStructure() {
        this.law = new Container('law', undefined, 0);
        const levels = ['book', 'title', 'chapter', 'section', 'subSection'];
        // loop over articles, if != 0 add to parent, and create grandparents
        for (let i = 0; i < this.articles.length; i++) {
            let parent = this.law;
            for (const level of levels) {
                if (this.articles[i][level] !== 0) {
                    // only create Container if not existing
                    const levelId = this.articles[i][level];
                    if (!this.getChildExists(this.law, level, this.articles[i][level])) {
                        // Create container if not existing
                        this[level + 's'][levelId] = new Container(level, parent, this.articles[i][level]);
                    }
                    parent.addNewChild(this[level + 's'][levelId]);
                    parent = this[level + 's'][levelId];
                }
            }
            parent.addChild(this.articles[i]);
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
