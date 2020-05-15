import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {Container, Language} from '../container';
import {MatTreeNestedDataSource} from '@angular/material/tree';


@Component({
    selector: 'app-toc',
    templateUrl: './toc.component.html',
    styleUrls: ['./toc.component.css']
})
export class TocComponent implements OnInit, OnChanges {
    treeControl = new NestedTreeControl<Container>(node => node.children);
    dataSource = new MatTreeNestedDataSource<Container>();
    @Input() children: Container[];
    @Input() language: Language;

    constructor() {

    }

    ngOnInit(): void {
        this.dataSource.data = this.children;
    }

    ngOnChanges(): void {
        this.dataSource.data = this.children;
    }

    hasContainerChild = (_: number, node: Container) => !!node.children && node.children.length > 0 && node.children[0].classId === 'Container';
    hasArticleChild = (_: number, node: Container) => !!node.children && node.children.length > 0 && node.children[0].classId === 'Article';
    hasChild = (_: number, node: Container) => !!node.children && node.children.length > 0;

    scrollToElement(id) {
        document.getElementById(id).scrollIntoView({behavior:'smooth', block: 'start'});
    }

}
