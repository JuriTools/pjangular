import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Law} from './law';


@Injectable({
    providedIn: 'root'
})
export class EjLawService {
    baseUrl = 'http://www.ejustice.just.fgov.be';
    url: string;
    language: string;
    doc;
    DOM;
    law: Law;

    constructor(private http: HttpClient) {
    }

    getDocEli(url) {
        this.language = 'nl';
        this.doc = this.http.get(url, {responseType: 'text'});
        return this.doc;
    }

    getDoc(url) {
        if (url.includes('eli/wet')) {
            return this.getDocEli(url);
        }
        console.log('In ej-law.service:getDoc()');
        console.log(url);
        // todo change frame handling, get correct url from site itself, pass that http.get as a promise
        this.language = this.setLanguage(url);
        const requireFrame = /cgi_loi\/(.*?)\?/.exec(url);
        console.log(requireFrame);
        if (requireFrame[1] === 'change_lg.pl') {
            console.log('Require Frame');
            url = url.replace(/.*?4200/, 'http://www.ejustice.just.fgov.be');
            let lawTab = 'wet';
            if (this.language === 'fr') {
                lawTab = 'loi';
            }
            url = url.replace('change_lg.pl', 'loi_a1.pl') + '&&caller=list&' + this.language[0].toUpperCase() + '&fromtab=' + lawTab + '&tri=dd+AS+RANK&rech=1&numero=1&sql=(text+contains+(%27%27))';
        }
        this.url = url;
        this.doc = this.http.get(url, {responseType: 'text'});
        console.log('URL:' + this.url);
        console.log(this.doc);
        return this.doc;
    }

    setLanguage(url) {
        // todo look at contents of site too
        console.log(url);
        const m = /language=([a-z]{2})/i.exec(url);
        console.log(m[1]);
        if (m) {
            return m[1];
        }
    }

    createLaw(data) {
        const DOM = this.getDOM(data);
        this.law = new Law(DOM, this.language);
        return this.law;
        // this.law.articles = this.parseArticles(DOM);
    }

    getLaw() {
        return this.law;
    }

    getDOM(doc) {
        let DOM = new DOMParser().parseFromString(doc, 'text/html');
        const frameDoc = DOM.querySelector('frame');
        if (frameDoc) {
            console.warn('Not providing correct url. No support yet for baseURL, require frame for now');
        }

        DOM = this.restructureDOM(DOM);
        DOM = this.restructureAsDiv(DOM);
        DOM = this.tagParagraphs(DOM);
        DOM = this.restructureNav(DOM);
        DOM = this.tagDates(DOM);
        DOM = this.tagDefinitions(DOM);
        DOM = this.tagWebLinks(DOM);

        DOM = this.tagArtRef(DOM);
        this.DOM = DOM;
        return DOM;
    }

    restructureDOM(doc) {
        /**
         * Summary. Tags main law elements
         * Description. Tags title, chapter, section and articles of the law or Decree.
         */
        const book = (this.language === 'fr') ? 'LIVRE' : 'BOEK';
        const title = (this.language === 'fr') ? 'Titre' : 'TITEL';
        const chapter = (this.language === 'fr') ? 'CHAPITRE' : 'HOOFDSTUK';
        const section = (this.language === 'fr') ? 'Section' : 'afdeling';
        const subSection = (this.language === 'fr') ? 'Sous-section' : 'onderafdeling';
        const article = (this.language === 'fr') ? 'Art' : 'Art';
        const appendix = (this.language === 'fr') ? '' : 'BIJLAGEN';
        // todo LNKR number does not indicate correct chapter number
        // todo Add book support
        const regextitle = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${title}\\s(.{1,16}?)\.<\/A>.*?)(?=(<A NAME=.{5,25}LNKR.{5,15}${title}|<A NAME=.{5,25}LNKR.{5,15}${appendix}))`, 'gi');
        const regexbook = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${book}\\s(.{1,16}?)\.<\\/A>.*?)(?=(<A NAME=.{5,25}LNKR.{5,15}${book}|<A NAME=.{5,25}LNKR.{5,15}${appendix}))`, 'gi');
        const regexchapter = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${chapter}\\s(.{1,16}?)\.<\/A>.*?)(?=(<A NAME=.{5,25}LNKR.{5,15}${chapter}|<A NAME=.{5,25}LNKR.{5,15}${appendix}))`, 'gi');
        const regexafd = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${section}\\s(.{1,16}?)\.<\/A>.*?)(?=(<A NAME=.{5,25}LNKR.{5,15}${section}|<A NAME=.{5,25}LNKR.{5,15}${appendix}))`, 'gi');
        const regexonderafd = new RegExp(`(<A NAME=.{5,25}LNKR(\\d*).{2,15}${subSection}\\s(.{1,16}?)\.<\/A>.*?)(?=(<A NAME=.{5,25}LNKR.{5,15}${subSection}|<A NAME=.{5,25}LNKR.{5,15}${appendix}))`, 'gi');
        const regexart = new RegExp(`(<a name=.{1,5}${article}\\.(\\d{1,4}.*?)('|").*?<BR><BR>)`, 'gi');
        const reghyperlink = new RegExp(`((\sname='LNKR.*?')|(\shref='#LNKR.*?'))`, 'gi');
        console.log(regexafd);

        // console.log(doc.body.innerHTML);
        doc.body.innerHTML = doc.body.innerHTML.replace(regextitle, '<lawtitle id="$2" title="$3">$1</lawtitle>');
        doc.body.innerHTML = doc.body.innerHTML.replace(regexbook, '<book id="$2" title="$3">$1</book>');
        doc.body.innerHTML = doc.body.innerHTML.replace(regexchapter, '<chapter id="$2" title="$3">$1</chapter>');
        doc.body.innerHTML = doc.body.innerHTML.replace(regexafd, '<section id="$2" title="$3">$1</section>');
        doc.body.innerHTML = doc.body.innerHTML.replace(regexonderafd, '<subsection id="$2" title="$3">$1</subsection>');
        doc.body.innerHTML = doc.body.innerHTML.replace(regexart, '<article id="$2">$1</article>');
        doc.body.innerHTML = doc.body.innerHTML.replace(reghyperlink, '');
        console.log(doc);
        return doc;
    }

    // todo parse Table of Content
    // tagTOC () {}


    restructureAsDiv(doc) {
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


    tagWebLinks(doc) {
        /**
         * Summary. Tag all weblinks in law text
         * Description. Tag weblinks in law text readding them as functioning hyperlink
         */
        if (doc === undefined) {
            return doc;
        }
        const lines = doc.getElementsByTagName('line');
        for (const line of lines) {
            if (line.innerHTML.match(/(http.*?)(\s|$)/)) {
                line.innerHTML = line.innerHTML.replace(/(http\s|http)(.*?)(\s|$)/, `<a href="http$2">http$2</a> `);
            }
        }
        return doc;
    }

    tagParagraphs(doc) {
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
                if (line.startsWith('(')) {// change inserted in article with ( )
                    /* Never yet seen ( with <sup>
                            let regexp = /(<sup>.*?<\/sup>)(.*)$/;
                            let res = regexp.exec(line); //get sup
                            try {
                                sup = '(' + res[1];
                                line = res[2].trim();
                            }
                            catch (err) { // Catch cases where no sup for some reason */
                    sup = '(';
                    line = line.substring(1);
                    // }
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
                                line = line.replace(reglink, `<a class=article name="$1">$1</a></line><line class=paragraph>$3</line>`);
                            } else {
                                line = line.replace(reglink, `<a class=article name="$1">$1</a>$3</line>`);
                            }
                        } catch (err) {
                            console.log(match, err);
                        }
                    }
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
                } else {
                    if (!line.startsWith('<font')) {
                        // console.log('No font for: ' + line);
                    }
                }
                lines[index] = `<line class=${lineclass}>${lid}${sup}${line}</line>`;
            });
            article.innerHTML = lines.join('<br>');
        }
        return doc;
    }


    restructureNav(doc) {
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
            for (const i in navelems) {
                // console.log(navelems[i].innerText, navelems[i].target);
                if (navelems[i].target === '_blank' || navelems[i].target === '_parent') {
                    // store element
                    const child = navelems[i].cloneNode(true);
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

    tagArtRef(doc) {
        /**
         * Summary. Tag article references
         * Description. Tag article references in all the 'line' tags to tag all the articles in this law
         */
        if (!doc) {
            return doc;
        }
        const lines = doc.getElementsByTagName('line');
        if (!lines) {
            return doc;
        }
        for (const line of lines) {
            if (line) {
                line.innerHTML = line.innerHTML.replace(/(Art(\.|ikel)\s\d{1,3}[a-z]*)/gi, '<artref>$1</artref>');
            }
        }
        return doc;
    }

    tagDates(doc) {
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
                    changes[i].innerHTML = changes[i].innerHTML.replace(/van\s(\d{2}-\d{2}-\d{4})/gi, `<changedate id=${i}>$1</changedate>`);
                    changes[i].innerHTML = changes[i].innerHTML.replace(/op\s(\d{2}-\d{2}-\d{4})/gi, `<changedatepub  id=${i}>$1</changedatepub>`);
                }
            } catch (err) {
                console.log(err);
            }
        }
        return doc;
    }


    tagDefinitions(doc) {
        if (doc === undefined) {
            return;
        }
        const wt = doc.getElementById('Wettekst');
        if (!wt) {
            return doc;
        }
        wt.innerHTML = wt.innerHTML.replace(/(\d{1,3}°\s*")(.*?)(")/gi, `<definition>$1<defname>$2</defname>$3</definition>`);
        return doc;
    }
}
