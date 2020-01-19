

export class Line {
  article: number;
  text: string;
  type;
  dom;
  date: Date;
  lidId: number;

  constructor(DOM, article) {
    this.article = article; // todo check if correct
    this.type = DOM.className;
    this.text = DOM.innerText.replace(/^Art.\d{1,4}(er)?/i, '');
    this.dom = DOM;
    if (DOM.querySelector('lid')) {
      this.lidId = DOM.querySelector('lid').id;
    }
  }
}
