import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTreeModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { EjLawComponent } from './ej-law/ej-law.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { EjArticleComponent } from './ej-article/ej-article.component';

@NgModule({
  declarations: [
    AppComponent,
    EjLawComponent,
    SafeHtmlPipe,
    EjArticleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule, MatCheckboxModule, MatCardModule,
    MatSidenavModule, MatMenuModule, MatIconModule, MatToolbarModule, MatTreeModule, MatFormFieldModule, MatInputModule, MatButtonToggleModule, MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
