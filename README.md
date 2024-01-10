# Book of Changes
## Explore the I Ching with Interactive Tools
### Features
#### Create Hexagrams
The [home](https://geoskogen.github.io/book-of-changes/) page generates a hexagram configuration from start to finish with interpretive dialog.  
#### Build Hexagrams
The [/build](https://geoskogen.github.io/book-of-changes/build/) page allows users to modify hexagram configuration lines, creating new configurations.  
#### Explore Trigrams
The [/trigrams](https://geoskogen.github.io/book-of-changes/trigrams/) page allows users to assemble various trigrams into a hexagram.  
#### Explore Hexagrams
The [/hexagrams](https://geoskogen.github.io/book-of-changes/hexagrams/) page provides filterable a tabbed view of all hexagrams with interpretive modals.
### What's new in version 2?
#### Accessibility
All components can be operated with a keyboard according to established ARIA design patterns, and the application is screen-reader compatible.  
#### Shareable Links
Both the home page and the /build page will render pre-set readings when configured via the URL query string.    
Examples:  
    `/?id=13&moving_lines=345`    
    `/build/?id=13&moving_lines=345`  
A completed configuration on the main page renders open-graph markup for social shares.
#### Filter Queries
The /hexagrams page will render a filtered view according to a URL query string.   
Example:  
    `/hexagrams/?segment=top&id=101`  
This will render all hexagrams whose top trigram is fire.  
#### API
All data operations in this application can be recreated with the API.
For example this request:  
    `/api/v1/hexagrams/?id=13&moving_lines=345&dual=true&verbose=true`  
--would return the same raw data utilized to render this page:
    `/?id=13&moving_lines=345`  
API v1 documentation is here: [https://geoskogen.github.io/book-of-changes/api/docs/v1](https://geoskogen.github.io/book-of-changes/api/docs/v1)  
The API controller does not require a database but it does require a server stack running PHP.  API controllers in Python, Node, and Ruby will be added in future versions.
