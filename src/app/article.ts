import { Line } from './line';


export class Article {
  artId: number;
  book = 0;
  title = 0;
  chapter = 0;
  section = 0;
  subSection = 0;
  element;
  name: string;
  public text: string;
  lines: Line[];
  group: string;

  constructor(DOM) {
    this.element = DOM;
    let parentNode = DOM.parentNode;
    while (parentNode.nodeName !== 'BODY') {
      if (parentNode.nodeName === 'BOOK') {
        this.book = parseInt(parentNode.id, 10);
      }
      if (parentNode.nodeName === 'LAWTITLE') {
        this.title = parseInt(parentNode.id, 10);
      }
      if (parentNode.nodeName === 'CHAPTER') {
        this.chapter = parseInt(parentNode.id, 10);
      }
      if (parentNode.nodeName === 'SECTION') {
        this.section = parseInt(parentNode.id, 10);
      }
      if (parentNode.nodeName === 'SUBSECTION') {
        this.subSection = parseInt(parentNode.id, 10);
      }
      // todo add other containers (think of converting roman numbers)
      parentNode = parentNode.parentNode;
    }
    this.artId = DOM.id;
    this.name = DOM.querySelector('a').text;
    this.text = DOM.innerText; // todo Create Lines of article
    this.lines = this.parseLines(DOM);
    this.group = this.book.toString() + this.title.toString() + this.chapter.toString() + this.section.toString() + this.subSection.toString();
  }

  parseLines(DOM) {
    const linesDom = DOM.querySelectorAll('line');
    const lines: Line[] = [];
    for (let i = 0; i < linesDom.length; i++) {
      lines[i] = new Line(linesDom[i], this.artId);

    }
    // console.log(lines);

    // todo remove empty lines
    return lines;
  }
}
