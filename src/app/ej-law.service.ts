import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Language, Law} from './law';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

const hostname = 'https://www.ejustice.just.fgov.be';

function replaceInnerHTML(oldElement, html: string): HTMLElement {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, 'text/html');
    const tags = parsed.getElementsByTagName('body')[0].children;
    const parent = oldElement.parentNode;
    const newElement = document.createElement(oldElement.nodeName);
    if (oldElement.id) {
        newElement.setAttribute('id', oldElement.id);
    }
    while (tags.length > 0) {
        newElement.appendChild(tags[0]);
    }
    // function has external effects
    parent.replaceChild(newElement, oldElement);
    return newElement;
}

@Injectable({
    providedIn: 'root'
})
export class EjLawService {
    urls: { nl: URL, fr: URL };
    language: Language;
    doc;
    DOM;
    laws: { nl: Law, fr: Law };

    constructor(private http: HttpClient) {
        this.laws = {nl: undefined, fr: undefined};
    }

    getLaw(url: URL, language?: Language): Observable<Law> {
        this.urls = this.parseUrl(url);
        language = language ? language : this.getLanguage(url);
        if (this.laws[language]) {
            return of(this.laws[language]);
        } else {
            this.doc = this.http.get(this.urls[language].href, {responseType: 'text'})
                .pipe(map(res => {
                    this.laws[language] = this.createLaw(res);
                    return this.laws[language];
                }));
        }
        return this.doc;
    }

    createLaw(data): Law {
        const DOM = this.getDOM(data);
        return new Law(DOM, this.language);
    }

    getURLs() {
        return this.urls;
    }

    getLanguage(url?: URL, DOM?): Language {
        const m = /language=([a-z]{2})/i.exec(url?.href);
        // tslint:disable-next-line
        if (m) {
            if (m[1] === 'nl' || m[1] === 'fr') {
                return m[1];
            }
        } else if (url?.href.match(/eli\/[decret|loi|constitution|arrete]/)) {
            return 'fr';
        } else if (url?.href.match(/eli\/[decreet|wet|grondwet|besluit]/)) {
            return 'nl';
        } else {
            const langCell = DOM?.querySelector('body > table:nth-child(4) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(5)');
            if (langCell?.textContent.includes('Frans')) {
                return 'nl';
            } else if (langCell?.textContent.includes('néerlandaise')) {
                return 'fr';
            }
        }
    }

    parseUrl(url: URL): { nl: URL, fr: URL } {
        // todo add regex tests for valid urls
        if (!url.href.includes('ejustice')) {
            throw new Error('Invalid URL');
        }
        let urlDutch = url.href;
        let urlFrench = url.href;

        url.href = url.href.replace(/staatsblad$/, 'justel');

        if (url.href.includes('eli')) {
            if (url.href.includes('eli/wet')) {
                urlDutch = url.href;
                urlFrench = url.href.replace('eli/wet', 'eli/loi');
            } else if (url.href.includes('eli/loi')) {
                urlFrench = url.href;
                urlDutch = url.href.replace('eli/loi', 'eli/wet');
            } else if (url.href.includes('eli/grondwet')) {
                urlDutch = url.href;
                urlFrench = url.href.replace('eli/grondwet', 'eli/constitution');
            } else if (url.href.includes('eli/constitution')) {
                urlFrench = url.href;
                urlDutch = url.href.replace('eli/constitution', 'eli/grondwet');
            } else if (url.href.includes('eli/decreet')) {
                urlDutch = url.href;
                urlFrench = url.href.replace('eli/decreet', 'eli/decret');
            } else if (url.href.includes('eli/decret')) {
                urlFrench = url.href;
                urlDutch = url.href.replace('eli/decret', 'eli/decreet');
            } else if (url.href.includes('eli/besluit')) {
                urlDutch = url.href;
                urlFrench = url.href.replace('eli/besluit', 'eli/arrete');
            } else if (url.href.includes('eli/arrete')) {
                urlFrench = url.href;
                urlDutch = url.href.replace('eli/arrete', 'eli/besluit');
            } else {
                throw new Error('Unknown ELI url variant');
            }
        }
        const requireFrame = /cgi_loi\/(.*?)\?/.exec(url.href);
        if (requireFrame) {
            url.href = url.href.replace(/.*?4200/, 'http://www.ejustice.just.fgov.be');
            urlDutch = url.href
                .replace('language=fr', 'language=nl')
                .replace('la=F', 'la=N');
            urlFrench = url.href
                .replace('language=nl', 'language=fr')
                .replace('la=N', 'la=F');
            if (!url.href.includes('caller=list')) {
                urlDutch += '&&caller=list&' + 'N' + '&fromtab=' + 'wet' + '&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))';
                urlFrench += '&&caller=list&' + 'F' + '&fromtab=' + 'loi' + '&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))';
            } else {
                urlDutch = urlDutch.replace('&F&', '&N&');
                urlFrench = urlFrench.replace('&N&', '&F&');
            }
            if (requireFrame[1] === 'change_lg.pl') {
                urlDutch = urlDutch.replace('change_lg.pl', 'loi_a1.pl');
                urlFrench = urlFrench.replace('change_lg.pl', 'loi_a1.pl');
            }
        }
        return {
            nl: new URL(urlDutch.replace(/=loi/g, '=wet')),
            fr: new URL(urlFrench.replace(/=wet/g, '=loi'))
        };
    }

    getDOM(doc): Document {
        let DOM = new DOMParser().parseFromString(doc, 'text/html');
        this.language = this.getLanguage(undefined, DOM);
        DOM = this.restructureDOM(DOM);
        DOM = this.restructureAsDiv(DOM);
        DOM = this.tagParagraphs(DOM);
        DOM = this.restructureNav(DOM);
        DOM = this.tagDates(DOM);
        DOM = this.tagDefinitions(DOM);
        DOM = this.tagWebLinks(DOM);
        this.DOM = DOM;
        return DOM;
    }

    restructureDOM(doc) {
        /**
         * Summary. Tags main law elements
         * Description. Tags title, chapter, section and articles of the law or Decree.
         */
        const book = (this.language === 'fr') ? 'LIVRE' : 'BOEK';
        const part = (this.language === 'fr') ? 'PARTIE' : 'Deel';
        const title = (this.language === 'fr') ? 'Titre' : 'TITEL';
        const chapter = (this.language === 'fr') ? 'CHAPITRE' : 'HOOFDSTUK';
        const section = (this.language === 'fr') ? 'Section' : 'afdeling';
        const subSection = (this.language === 'fr') ? 'Sous-section' : 'onderafdeling';
        const article = (this.language === 'fr') ? 'Art' : 'Art';
        const appendix = (this.language === 'fr') ? '__' : 'BIJLAGEN';

        // todo tag errata and modifications
        const errata = (this.language === 'fr') ? 'Erratum' : 'Erratum';
        const modifications = (this.language === 'fr') ? 'Modification(s)' : 'Wijziging(en)';

        const regexbook = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${book}\\s(.{1,16}?)\.<\\/A>[\\s\\S]*?)(?=<A NAME=.{1,25}(LNKR.{5,15}(${book}|${appendix})|signature))`, 'gi');
        const regexpart = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${part}\\s(.{1,16}?)\.<\\/A>[\\s\\S]*?)(?=<A NAME=.{1,25}(LNKR.{5,15}(${part}|${appendix})|signature))`, 'gi');
        const regextitle = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${title}\\s(.{1,16}?)\.<\/A>[\\s\\S]*?)(?=<A NAME=.{1,25}(LNKR.{5,15}(${title}|${appendix})|signature)|</book>)`, 'gi');
        const regexchapter = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${chapter}\\s(.{1,16}?)\.<\/A>[\\s\\S]*?)(?=<A NAME=.{1,25}(LNKR.{5,15}(${chapter}|${appendix})|signature)|</book>|</lawtitle>)`, 'gi');
        const regexafd = new RegExp(`(<A NAME=.{17}LNKR(\\d*).{1,5}>${section}\\s(.{1,16}?)\.<\/A>[\\s\\S]*?)(?=<A NAME=.{5,25}(LNKR.{5}>(${section}|${appendix})|signature)|</book>|</lawtitle>|</chapter>)`, 'gi');
        const regexonderafd = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${subSection}\\s(.{1,16}?)\.<\/A>[\\s\\S]*?)(?=<A NAME=.{5,25}(LNKR.{5,15}(${subSection}|${appendix})|signature)|</book>|</lawtitle>|</chapter>|</section>)`, 'gi');
        const regexart = new RegExp(`(<a name=.{1,5}${article}.(\\d{1,4}.*?)('|")[\\s\\S]*?(<BR><BR>|signature))`, 'gi');
        const reghyperlink = new RegExp(`((\sname='LNKR.*?')|(\shref='#LNKR.*?'))`, 'gi');

        let tempBody = doc.body.innerHTML.replace(regexbook, '<book id="$2" title="$3">$1</book>');
        tempBody = tempBody.replace(regexpart, '<part id="$2" title="$3">$1</part>');
        tempBody = tempBody.replace(regextitle, '<lawtitle id="$2" title="$3">$1</lawtitle>');
        tempBody = tempBody.replace(regexchapter, '<chapter id="$2" title="$3">$1</chapter>');
        tempBody = tempBody.replace(regexafd, '<section id="$2" title="$3">$1</section>');
        tempBody = tempBody.replace(regexonderafd, '<subsection id="$2" title="$3">$1</subsection>');
        tempBody = tempBody.replace(regexart, '<article id="$2">$1</article>');
        tempBody = tempBody.replace(reghyperlink, '');
        replaceInnerHTML(doc.body, tempBody);
        return doc;
    }

    // todo parse Table of Content
    // tagTOC () {}


    restructureAsDiv(doc): Document {
        /**
         * Summary. Create DOM structure using divs
         * Description. Create a new DOM structure using Div's and removing tables. Adds collapsible for each div
         */
        let title = '';
        let nav = 'J U S T E L';
        let toc = 'Inhoudstafel';
        let text = 'Tekst';
        let change = 'Wijziging';
        let start = 'Begin';
        let preambule = 'Aanhef';
        let signature = 'Handtekening';
        let errata = 'Errat';

        if (this.language === 'fr') {
            title = '';
            nav = 'J U S T E L';
            toc = 'Table des matières';
            text = 'Texte';
            change = 'mod';
            start = 'Début';
            preambule = 'Préambule';
            signature = 'Signatures';
            errata = 'Errat';
        }
        const coll = doc.getElementsByTagName('table');
        let wettekst = 0;
        for (let i = 0; i < coll.length; i++) {
            let div = coll[i].rows[0].textContent.trim();
            if (div === title) {
                div = 'Wetstitel';
            } else if (div.startsWith(nav)) {
                div = 'Navigation';
            } else if (div.startsWith(toc)) {
                div = 'Inhoudstafel';
            } else if (div.startsWith(text)) {
                div = 'Wettekst';
                wettekst = i;
            } else if (div.startsWith(change)) {
                div = 'Wijzigingen';
            } else if (div.startsWith(start)) {
                div = 'Footer';
            } else if (div.startsWith(preambule)) {
                div = 'Aanhef';
            } else if (div.startsWith(signature)) {
                div = 'Footer';
            } else if (div.startsWith(errata)) {
                div = 'Erratum';
                const elements = doc.getElementsByTagName('h3');
                while (elements[0]) {
                    elements[0].parentNode.removeChild(elements[0]);
                }
            } else if (div.startsWith('Parlementaire werkzaamheden')) {
                div = 'ParlementaireWerkzaamheden';
            } else {
                try {
                    if (i > 0) {// Educated guess that tables only exist in wettekst
                        coll[wettekst].appendChild(coll[i]);
                    }
                } catch (err) {
                    console.log(err);
                }
                continue;
            }
            // Place divs as children of body
            const child = coll[i];
            const parent = coll[i].parentNode;
            const wrapper = doc.createElement('div');
            wrapper.setAttribute('id', div);
            parent.replaceChild(wrapper, child);
            wrapper.appendChild(child);
        }
        return doc;
    }


    tagWebLinks(doc): Document {
        /**
         * Summary. Tag all weblinks in law text
         * Description. Tag weblinks in law text reading them as functioning hyperlink
         */
        if (doc === undefined) {
            return doc;
        }
        const lines = doc.getElementsByTagName('line');
        for (const line of lines) {
            if (line.innerHTML.match(/([^href="]http.*?)(\s|$)/)) {
                // line.innerHTML = line.innerHTML.replace(/(http\s|http)(.*?)(\s|$)/, `<a href="http$2">http$2</a> `);
                replaceInnerHTML(line, line.innerHTML.replace(/[^href="](http\s|http)(.*?)(\s|$)/, `<a href="http$2">http$2</a> `));
            }
        }
        return doc;
    }

    tagParagraphs(doc): Document {
        /**
         * Summary. Tag paragraphs in articles
         * Description. Tag paragraphs in each article adding 'lid' tag for each
         */
            // todo store articles in array/database including placement in document (title, chapter, etc.)
        const articles = doc.getElementsByTagName('article');
        for (const article of articles) {
            let counter = 1;
            const lines = article.innerHTML.split('<br>&nbsp;&nbsp;');
            lines.forEach((line, index) => {
                let lineclass = '';
                let sup = '';
                let lid = '';
                line = line.trim();
                if (line.startsWith('[')) {// change inserted in article with [ ]
                    const regexp = /(<sup>.*?<\/sup>)(.*)$/;
                    const res = regexp.exec(line); // get sup
                    try {
                        sup = '[' + res[1];
                        line = res[2].trim();
                    } catch (err) { // Catch cases where no sup for some reason
                        sup = '[';
                        line = line.substring(1);
                    }
                }

                if (line.startsWith('§')) { // start of paragraph
                    counter = 1; // reset counter
                    lineclass = 'paragraph';
                } else if (line.startsWith('--')) {// dashed line of --
                    counter = 1;
                    lineclass = 'dashedlined';
                } else if (line.startsWith('...')) {// dashed line of --
                    counter = 1;
                    lineclass = 'removedline';
                } else if (line.match(/^.{0,5}<a/i)) {// start of article
                    counter = 1;
                    lineclass = 'articlestart';
                    const reglink = /<a name="(.*?)".*a>(\.\s|\.)(.*)/;
                    const match = reglink.exec(line);
                    if (match) {
                        try {
                            if (match[3].startsWith('§')) {
                                line = line.replace(reglink, `<a class=article name="$1">$1</a></line><line class=paragraph>$3`);
                            } else {
                                line = line.replace(reglink, `<a class=article name="$1">$1</a>$3`);
                            }
                        } catch (err) {
                            console.log(match, err);
                        }
                    }
                    line = line.replace(/^<a.*?<\/a>/i, ''); // remove useless link prepending articles
                } else if (line.match(/^.{0,5}\d{1,3}/i)) { // e.g. 13°
                    counter = 1;
                    lineclass = 'dotlist';
                } else if (line.match(/^.{0,5}\)/i)) {// e.g. a)
                    counter = 1;
                    lineclass = 'bracketlist';
                } else if (line.match(/^-[^-]/)) {
                    lineclass = 'dashlist';
                } else if (line.match(/^[A-Z]/)) { // new lid
                    counter++;
                    lineclass = 'artlid';
                    lid = `<lid id="${counter}"></lid> `;
                } else if (line.match(/^\(.*&gt;.{0,10}$/gmi)) {
                    lineclass = 'artworkingdate';
                } else {
                    if (!line.startsWith('<font')) {
                        // console.log('No font for: ' + line);
                    }
                }
                line = line.replace(/a href="(.*?)"/gi, `a href=\"${hostname}$1\"`); // create full urls
                lines[index] = `<line class=${lineclass}>${lid}${sup}${line}</line>`;
            });

            // article.innerHTML = lines.join('<br>');
            replaceInnerHTML(article, lines.join('<br>'));
        }
        return doc;
    }


    restructureNav(doc): Document {
        /**
         * Summary. Get useful elements from navigation panel, recreate nav panel afterwards
         */
        try {
            const nav = doc.getElementById('Navigation');
            if (!nav) {
                return doc;
            }
            const navelems = nav.getElementsByTagName('table')[0].getElementsByTagName('a');
            const navdiv = document.createElement('div');
            navdiv.setAttribute('id', 'navdiv');
            nav.appendChild(navdiv);
            for (const cell of navelems) {
                // console.log(navelems[i].innerText, navelems[i].target);
                if (cell.target === '_blank' || cell.target === '_parent') {
                    // store element
                    const child = cell.cloneNode(true);
                    const parent = navdiv;
                    const wrapper = doc.createElement('div');
                    wrapper.setAttribute('id', child.innerText.replace(/(\s|\d)*\S*?\s*/g, ''));
                    parent.appendChild(wrapper);
                    wrapper.appendChild(child);
                }
            }
            nav.removeChild(nav.getElementsByTagName('table')[0]);
            nav.appendChild(navdiv);
        } catch (err) {
            console.log(err);
        }
        return doc;
    }

    tagDates(doc): Document {
        /**
         * Summary. Tag dates
         * Description. Tag all dates in changes section of the document
         * @type {NodeListOf<Element>}
         */
        if (doc === undefined) {
            return;
        }
        if (doc.getElementById('Wijzigingen')) {
            try {
                const changes = doc.getElementById('Wijzigingen').getElementsByTagName('li');
                for (let i = 0; i < changes.length; i++) {
                    let tempChangesHTML = changes[i].innerHTML.replace(/van\s(\d{2}-\d{2}-\d{4})/gi, `<changedate id=${i}>$1</changedate>`);
                    tempChangesHTML = tempChangesHTML.replace(/op\s(\d{2}-\d{2}-\d{4})/gi, `<changedatepub  id=${i}>$1</changedatepub>`);
                    replaceInnerHTML(changes[i], tempChangesHTML);
                }
            } catch (err) {
                console.log(err);
            }
        }
        return doc;
    }


    tagDefinitions(doc): Document {
        if (doc === undefined) {
            return;
        }
        const wt = doc.getElementById('Wettekst');
        if (!wt) {
            return doc;
        }
        replaceInnerHTML(wt, wt.innerHTML.replace(/(\d{1,3}°\s*")(.*?)(")/gi, `<definition>$1<defname>$2</defname>$3</definition>`));
        return doc;
    }
}
