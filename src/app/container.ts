export type Language = 'nl' | 'fr';

function createTitleLable(title: string): string {
    const splitFirstLetter = title.match(/(^[^[a-zA-Z]*)(.*)/);
    title = splitFirstLetter[1] + splitFirstLetter[2].charAt(0) + splitFirstLetter[2].slice(1).toLowerCase();
    title = title.replace(/belgi(.)/, `Belgi$1`);
    return title;
}

export class Container {
    classId = 'Container';
    type: string;
    typeLabel: string;
    parent: Container;
    children;
    id: number;
    title: string;
    titleLabel: string;
    DOM;

    constructor(type, id = 0, title, DOM, language: Language) {
        this.type = type;
        this.typeLabel = this.getTypeLabel(type, language);
        this.id = id || 0;
        this.children = [];
        this.title = title;
        this.titleLabel = this.getTitleLabel(DOM);
        this.DOM = DOM;
    }

    getTitleLabel(DOM) {
        let titleMatch;
        if (DOM.body) {
            titleMatch = DOM.body.innerHTML.match(/a>\s-\s(.*?)(<br>|&lt;)/);
        } else {
            titleMatch = DOM.innerHTML.match(/a>\s-\s(.*?)(<br>|&lt;)/);
        }
        if (titleMatch) {
            return createTitleLable(titleMatch[1]);
        } else {
            return '';
        }
    }

    getTypeLabel(type, language: Language) {
        const labels = {
            book: language === 'nl' ? 'Boek' : 'Livre',
            part: language === 'nl' ? 'Deel' : 'Partie',
            lawtitle: language === 'nl' ? 'Titel' : 'Title',
            chapter: language === 'nl' ? 'Hoofdstuk' : 'Chapitre',
            section: language === 'nl' ? 'Afdeling' : 'Section',
            subsection: language === 'nl' ? 'Onderafdeling' : 'Sous-section'
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
