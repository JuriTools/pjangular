import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../article';
import {Container} from '../container';

@Component({
    selector: 'app-toc-container',
    templateUrl: './toc-container.component.html',
    styleUrls: ['./toc-container.component.scss']
})
export class TocContainerComponent implements OnInit {
    @Input() items: Container[] | Article[];

    constructor() {
    }

    ngOnInit() {
    }

    isArticle(item) {
        return item?.classId === 'Article';
    }

    isContainer(item) {
        return item?.classId === 'Container';
    }

    getRange(): { first: Container | Article, last: Container | Article } {
        return {
            first: this.getFirstItem(),
            last: this.getLastItem()
        };
    }

    getFirstItem(): Container | Article {
        const firstItem = this.items[0];
        return firstItem;
    }

    getLastItem(): Container | Article {
        const lastItem = this.items[this.items.length - 1];
        return lastItem;
    }

    getFirstChild(): Container | Article {
        const firstItem = this.items[0];
        return firstItem;
    }

    getLastChild(): Container | Article {
        const lastItem = this.items[this.items.length - 1];
        return lastItem;
    }
}
