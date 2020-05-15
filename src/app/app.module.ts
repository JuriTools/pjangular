import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {EjLawComponent} from './ej-law/ej-law.component';
import {SafeHtmlPipe} from './safe-html.pipe';
import {EjArticleComponent} from './ej-article/ej-article.component';
import {EjContainerComponent} from './ej-container/ej-container.component';
import {TocComponent} from './toc/toc.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
    declarations: [
        AppComponent,
        EjLawComponent,
        SafeHtmlPipe,
        EjArticleComponent,
        EjContainerComponent,
        TocComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatTreeModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatListModule,
        MatSlideToggleModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
