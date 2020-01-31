import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../article';

@Component({
  selector: 'app-toc-container',
  templateUrl: './toc-container.component.html',
  styleUrls: ['./toc-container.component.css']
})
export class TocContainerComponent implements OnInit {
  @Input() items;
  constructor() { }

  ngOnInit() {
  }

  getIsArticle(item) {
    return typeof item === typeof Article;
  }
}
