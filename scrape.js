// This job will be reposible for scraping the birds list of the israbirding.com site.
// Once scraped, it will spawn a number of child process (based on number of cpus?) to scrape
// Wikipedia for the pages of each of the species.
var request = require('request');
var async = require('async');
var nodeio = require('node.io');
var fs = require('fs');
var path = require('path');
var log = require("./log").log;


request.defaults({
    "User-Agent": "BirdData/1.1 (http://www.israbirding.com/; israbirding@gmail.com)"
});

function parseSpeciesName(orig) {
    return (orig.replace(/\ /g, "_"));
}

function scrapeWikiPage(species_name) {
    //Second cycle.. Scrape and save only data is not already present
    var filename = "./birds-kb/" + species_name + "_data.txt";
    var stats = fs.lstatSync(filename);
    if (!stats || stats.size < 121) {
        console.log(species_name + "::1-Scraping");
        request('http://en.wikipedia.org/wiki/' + species_name).pipe(fs.createWriteStream(filename));
    } else {
        log(species_name + "::0-Skipped scraping");
    }
}


var doneOnce = false;
var g_speciesList = [];
var q = null;

var CONCURRENT = 10;
var TIMEOUT = 4 * 1000;

function doIt(species) {

    if (!doneOnce) {
        doneOnce = true;
        g_speciesList = species;
        q = async.queue(function(item, callback) {
            scrapeWikiPage(item.bird);
            setTimeout(callback, TIMEOUT);
        }, CONCURRENT);

        addToQueue();


        q.drain = function() {
            console.error("Done scraping");
        };
    }

}

function addToQueue(species_name) {
    var new_item = g_speciesList.pop();
    if (new_item) {
        q.push({
            bird: new_item
        }, addToQueue);
    }
    if (q.length() < CONCURRENT / 2) {
        addToQueue(); //Fill up
        log("Fill up queue");
    }

}

function scrapeList() {
    nodeio.scrape(function() {
        this.getHtml('http://israbirding.com/checklist/', function(err, $) {
            var species = [];
            $('#main_list tr td.en').each(function(bird_species) {
                species.push(parseSpeciesName(bird_species.text));
            });
            doIt(species);
        });
    });
}

scrapeList();