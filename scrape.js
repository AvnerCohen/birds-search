// This job will be reposible for scraping the birds list of the israbirding.com site.
// Once scraped, it will spawn a number of child process (based on number of cpus?) to scrape
// Wikipedia for the pages of each of the species.
var nodeio = require('node.io');
var async = require('async');
var fs = require('fs');
var child_proc = require('child_process');
var path = require('path');

function parseSpeciesName(orig) {
    return (orig.replace(/\ /g, "_"));
}

function scrapeWikiPage(species_name, callback) {
    console.log(species_name + "::1-Scraping");
    nodeio.scrape(function() {
        this.get('http://en.wikipedia.org/wiki/', function(err, data) {
            console.log(species_name + "::2-DataRecevied");

            if (err) {
                saveToDisk("error" + species_name, err);
            } else {
                saveToDisk(species_name, data);
            }
            callback(species_name);
        });
    });


}

function saveToDisk(species_name, data) {
    console.log(species_name + "::3-Saving");
    fs.writeFile("./birds-kb/" + species_name + "_data.txt", data, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

var doneOnce = false;
var g_speciesList = [];
var q = null;

function doIt(species) {

    if (!doneOnce) {
        doneOnce = true;
        g_speciesList = species;
        q = async.queue(function(item, callback) {
            scrapeWikiPage(item.bird, callback);
        }, 5);

        while(g_speciesList.length){
          addToQueue();
        }
        q.on("drain",function() {
            console.error("Done scraping");
        });
    }

}

function addToQueue() {
    var new_item = g_speciesList.pop();
    q.push({
        bird: new_item
    }, addToQueue);

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