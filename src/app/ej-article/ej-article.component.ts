import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../article';
import {Line} from '../line';
import {DataSource} from '@angular/cdk/collections';


@Component({
    selector: 'app-ej-article',
    templateUrl: './ej-article.component.html',
    styleUrls: ['./ej-article.component.scss']
})
export class EjArticleComponent implements OnInit {
    text: string;
    lines: Line[];
    @Input()
    article: Article;

    constructor() {
    }

    ngOnInit() {
        this.text = this.article.text;
        this.lines = this.article.lines;
    }

    getTableColumns(table: DataSource<object>) {
        if (table === undefined){
            return [];
        }
        return Object.keys(table[0]);
    }

}
