import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../article';

@Component({
    selector: 'app-ej-container',
    templateUrl: './ej-container.component.html',
    styleUrls: ['./ej-container.component.css']
})
export class EjContainerComponent implements OnInit {
    @Input() items;

    constructor() {
    }

    ngOnInit() {
    }

    // get if type of item is article, then print
    getIsArticle(item) {
        return item.constructor.name === 'Article';
    }
}
