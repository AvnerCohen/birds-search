Birds Search 
====

This is a sample repo of a work with the following libs/frameworks:

* Node JS - Server side
    * flatiron/director - Routing lib
    * ecstatic - Serve static files
    * cheerio - A jquery core selector implentation 
    * Node.IO  - scraping lib (can be     removed..)
    * node-solr - Apache Solr client
* Apache Solr - search engine


The flow of setting up the project is as follows:

### 1 ###


    node scrape
    
This will start a process to scrape the list of birds recorded in israeli from: http://www.israbirding.com/checklist/ 

Than, with a minor tweak on the bird names, it will scrape the relevant bird pages from wikipedia.

### 2 ###

    solr /path/to/config

Make sure solr is up.

### 3 ###

    node solr-index

process to pick up the files scraped from the web and create the solr documents

### 4 ###

    node app
    
Start the web server

You should now be able to http://127.0.0.1:8080/ locally and play around with the data

     