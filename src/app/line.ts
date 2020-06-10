export class Line {
    article: number;
    text: string;
    type;
    dom;
    date: Date;
    lidId: number;

    constructor(DOM, article) {
        this.article = article;
        this.type = DOM.className;
        this.text = this.getLineText(DOM.innerHTML);
        this.dom = DOM;
        if (DOM.querySelector('lid')) {
            this.lidId = DOM.querySelector('lid').id;
        }
    }

    getLineText(lineHTML) {
        lineHTML = lineHTML.trim();
        if (lineHTML.startsWith(`${this.article}`)) {
            lineHTML = lineHTML.slice(3);
        }
        return lineHTML.trim();
    }
}
