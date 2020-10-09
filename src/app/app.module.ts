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

import {AppComponent} from './app.component';
import {EjLawComponent} from './ej-law/ej-law.component';
import {SafeHtmlPipe} from './safe-html.pipe';
import {EjArticleComponent} from './ej-article/ej-article.component';
import {EjContainerComponent} from './ej-container/ej-container.component';
import {TocComponent} from './toc/toc.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {EjusticeLibModule} from 'ejustice-lib';
import {PdfDialogComponent} from './ej-law/pdf-dialog/pdf-dialog.component';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
    declarations: [
        AppComponent,
        EjLawComponent,
        SafeHtmlPipe,
        EjArticleComponent,
        EjContainerComponent,
        TocComponent,
        PdfDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        EjusticeLibModule,
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
        MatSlideToggleModule,
        MatTooltipModule,
        MatTableModule,
        FormsModule,
        MatDialogModule,
        MatSelectModule,
        MatRadioModule,
        MatChipsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
