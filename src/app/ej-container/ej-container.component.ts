import {Component, Input, OnInit} from '@angular/core';
import {Article} from 'ejustice-lib';
import {Container} from 'ejustice-lib';

@Component({
    selector: 'app-ej-container',
    templateUrl: './ej-container.component.html',
    styleUrls: ['./ej-container.component.scss']
})
export class EjContainerComponent implements OnInit {
    @Input() items: Container[] | Article[];

    constructor() {
    }

    ngOnInit() {
    }

    // get if type of item is article, then print
    isArticle(item) {
        return item?.classId === 'Article';
    }

    isContainer(item) {
        return item?.classId === 'Container';
    }
}
