import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../article';
import {Line} from '../line';


@Component({
  selector: 'app-ej-article',
  templateUrl: './ej-article.component.html',
  styleUrls: ['./ej-article.component.scss']
})
export class EjArticleComponent implements OnInit {

  name: string;
  text: string;
  lines: Line[];
  @Input()
  article: Article;

  constructor() {
  }

  ngOnInit() {
    this.name = this.article.name;
    this.text = this.article.text;
    this.lines = this.article.lines;
  }

}
