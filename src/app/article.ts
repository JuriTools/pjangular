import {Line} from './line';
import {Language} from './container';


export class Article {
    classId = 'Article';
    label: 'Article' | 'Artikel';
    typeLabel: 'Article' | 'Artikel';
    type: 'Article' | 'Artikel';
    title: string;
    artId: string;
    id: string;
    book = 0;
    // title = 0;
    chapter = 0;
    section = 0;
    subSection = 0;
    element;
    // name: string;
    public text: string;
    lines: Line[];
    group: string;
    tables: any[];

    constructor(DOM, language: Language) {
        this.element = DOM;
        this.artId = DOM.id;
        this.id = DOM.id;
        this.title = DOM.id;
        this.tables = [];
        this.label = language === 'fr' ? 'Article' : 'Artikel';
        this.typeLabel = language === 'fr' ? 'Article' : 'Artikel';
        this.type = language === 'fr' ? 'Article' : 'Artikel';
        DOM = this.parseTables(DOM);
        while (DOM.getElementsByTagName('font').length > 0){
            const table = DOM.getElementsByTagName('font')[0];
            table.parentNode.removeChild(table)
        }
        this.text = DOM.innerHTML;
        this.lines = this.parseLines(DOM);
        this.group = this.book.toString() + this.title.toString() + this.chapter.toString() + this.section.toString() + this.subSection.toString();

    }

    parseLines(DOM) {
        const linesDom = DOM.querySelectorAll('line');
        const lines: Line[] = [];
        let tableIndex = 0;
        for (let i = 0; i < linesDom.length; i++) {
            if (linesDom[i].className === 'table') {
                lines[i] = new Line(linesDom[i], this.artId, this.tables[tableIndex]);
                tableIndex++;
            } else {
                lines[i] = new Line(linesDom[i], this.artId);
            }
        }
        return lines;
    }

    parseTables(DOM){
        const tables = DOM.getElementsByTagName('font');
        for (const table of tables ){
            if (table.innerText.length > 0) {
                const l = document.createElement('line')
                l.className = 'table';
                l.id = String(this.tables.length);
                const tableJSON = [];
                const lines = table.getElementsByTagName('line');
                for (const line of lines) {
                    const colSplit = line.innerText.split(/\s{2,}/)
                    const row: string[] = [];
                    for (const col of colSplit) {
                        row.push(col);
                    }
                    tableJSON.push(row);
                }
                this.tables.push(this.JSON2DataSource(tableJSON));
                table.insertAdjacentElement('afterend', l)
            }
        }
        return DOM;
    }

    JSON2DataSource(jsonTable){
        const columnHeaders = jsonTable[0];
        const rows = []
        for (const row of jsonTable.splice(1)){
            const rowDict = {}
            for (let [index, col] of columnHeaders.entries()) {
                if (col === ''){
                    col = 0
                }
                rowDict[col] = row[index];
            }
            rows.push(rowDict);
        }
        return rows;
    }
}
