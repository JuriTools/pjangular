# Todo
- Fix assignment to innerHTML
- Fix that <a> is used to pass the articles text
- Fix ToC by using mat-tree
- Add tests
- Add link to laws in modifications of articles
- Add button to display original article text
- Add citation button
- Add container titles to article on hover
- Fix small parsing errors 

## Back end
- Add service to search in preformatted database (ElasticSearch?)
- Add service for ingress from preformatted database

## Extension
- Export as a plugin for Chrome & Firefox
    - Create separate extension to refer ejustice links to own site, passing url as argument
            - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests
        
## Front end 
- Update layout and design
    - ToC: mat-tree
        - convert law containers to JSON
- Add error message on failed url
- Add animation on switching language
    
## Functionality
- Versioning / diff between versions
- Add support for adding law to wettenbundel
    - Add to extension
    - Add to hosted site
