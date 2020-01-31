import {Component, Input, OnInit} from '@angular/core';
import {Container} from '@angular/compiler/src/i18n/i18n_ast';

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

    getItemType(item) {
        return typeof item;
    }

    // get if type of item is article, then print
}
