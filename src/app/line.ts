

export class Line {
  article: number;
  text: string;
  type;
  dom;
  date: Date;
  lidId: number;

  constructor(DOM, article) {
    this.article = article;
    this.type = DOM.className;
    this.text = DOM.innerHTML;
    this.dom = DOM;
    if (DOM.querySelector('lid')) {
      this.lidId = DOM.querySelector('lid').id;
    }
  }
}
