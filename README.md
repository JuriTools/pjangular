# PjAngular
![Build](https://github.com/mvwestendorp/pjangular/workflows/Build/badge.svg?branch=master)
![Test](https://github.com/mvwestendorp/pjangular/workflows/Test/badge.svg?branch=master)

## Todo
- Fix ToC by using mat-tree
- Fix warning sanitizing url
- Add tests
- Add link to laws in modifications of articles
- Add button to display original article text
- Add citation button
- Add container titles to article on hover
- Fix small parsing errors 

### Back end
- Add service to search in preformatted database (ElasticSearch?)
- Add service for ingress from preformatted database

### Extension
- Export as a plugin for Chrome & Firefox
    - Create separate extension to refer ejustice links to own site, passing url as argument
            - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests
        
### Front end 
- Update layout and design
    - ToC: mat-tree
        - convert law containers to JSON
- Add error message on failed url
- Add animation on switching language
    
### Functionality
- Versioning / diff between versions
- Add support for adding law to wettenbundel
    - Add to extension
    - Add to hosted site

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

