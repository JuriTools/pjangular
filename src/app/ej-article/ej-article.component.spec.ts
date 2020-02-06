import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EjArticleComponent} from './ej-article.component';
import {Component} from '@angular/core';
import {Article} from '../article';



describe('EjArticleComponent', () => {
    let component: EjArticleComponent;
    let fixture: ComponentFixture<EjArticleComponent>;

    const articleData = {
        article: '<article id="1"><line class="articlestart"><a class="article" name="Art.1">Art.1</a>Het misdrijf, naar de wetten strafbaar met een criminele straf, is een misdaad.</line><br><line class="artlid"><lid id="2"></lid> Het misdrijf, naar de wetten strafbaar met een correctionele straf, is een wanbedrijf.</line><br><line class="artlid"><lid id="3"></lid> Het misdrijf, naar de wetten strafbaar met een politiestraf, is een overtreding.<br><br></line></article>'
    };
    const testDOM = new DOMParser().parseFromString(articleData.article, 'text/html').querySelector('article');
    console.log(testDOM);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EjArticleComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        // todo add name, text etc to create proper article component
        // fixture = TestBed.createComponent(EjArticleComponent);
        // component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        // todo fix test
        // TestHostComponent.setArticle(new Article(testDOM));
        //fixture.detectChanges();
        // expect(component).toBeTruthy();
    });

    @Component({
        selector: `app-host-component`,
        template: `
            <app-ej-article></app-ej-article>`
    })
    class TestHostComponent {
        private static article: Article;

        static setArticle(article: Article) {
            this.article = article;
        }
    }
});

