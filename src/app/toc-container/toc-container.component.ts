import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../article';
import {Container} from '../law';

@Component({
  selector: 'app-toc-container',
  templateUrl: './toc-container.component.html',
  styleUrls: ['./toc-container.component.scss']
})
export class TocContainerComponent implements OnInit {
  @Input() items: Container[] | Article[];
  constructor() { }

  ngOnInit() {
  }

    getIsArticle(item) {
        return item.constructor.name === 'Article';
    }
}
