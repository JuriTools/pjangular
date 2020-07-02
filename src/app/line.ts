import {DataSource} from '@angular/cdk/collections';

export class Line {
    article: number;
    text: string;
    type;
    dom;
    date: Date;
    table: DataSource<object>;
    lidId: number;

    constructor(DOM, article, table?) {
        this.article = article;
        this.type = DOM.className;
        this.text = this.getLineText(DOM.innerHTML);
        this.dom = DOM;
        this.table = table;
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
