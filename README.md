# PjAngular
![Build](https://github.com/mvwestendorp/pjangular/workflows/Build/badge.svg?branch=master)
![Test](https://github.com/mvwestendorp/pjangular/workflows/Test/badge.svg?branch=master)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Build extension package
Run `ng build --prod --sourceMap=false --output-hashing=none && web-ext build -s 'dist/pj-angular/'` to build the packed extension for production in the `web-ext-artifacts` directory. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
