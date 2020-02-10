import {Line} from './line';
import {Language} from './law';


export class Article {
    classId = 'Article';
    label: 'Article' | 'Artikel';
    artId: string;
    book = 0;
    title = 0;
    chapter = 0;
    section = 0;
    subSection = 0;
    element;
    // name: string;
    public text: string;
    lines: Line[];
    group: string;

    constructor(DOM, language: Language) {
        this.element = DOM;
        this.artId = DOM.id;
        this.label = language === 'fr' ? 'Article' : 'Artikel';
        this.text = DOM.innerText; // todo Create Lines of article
        this.lines = this.parseLines(DOM);
        this.group = this.book.toString() + this.title.toString() + this.chapter.toString() + this.section.toString() + this.subSection.toString();
    }

    parseLines(DOM) {
        const linesDom = DOM.querySelectorAll('line');
        const lines: Line[] = [];
        for (let i = 0; i < linesDom.length; i++) {
            lines[i] = new Line(linesDom[i], this.artId);

        }
        // todo remove empty lines
        // todo tag lines indicating modfications
        return lines;
    }
}
