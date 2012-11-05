// This job will be reposible for scraping the birds list of the israbirding.com site.
// Once scraped, it will spawn a number of child process (based on number of cpus?) to scrape
// Wikipedia for the pages of each of the species.
var nodeio = require('node.io');
var async = require('async');

var spawn = require('child_process').spawn;
var path = require('path');

nodeio.scrape(function() {
    this.getHtml('http://israbirding.com/checklist/', function(err, $) {
        var species = [];

        $('#main_list tr td.en').each(function(bird_species) {
            species.push(parseSpeciesName(bird_species.text));
        });
        swarm(species);
    });
});

function parseSpeciesName(orig) {
    return (orig.replace(/\ /g, "_"));
}

//Now, scrape the wiki page and save each on to birds-kb spot:
//http://en.wikipedia.org/wiki/xxxxx

function savePageToDisk(species_name, data) {

}

function scrapePageFromWiki(species_name) {

}

function scrapeChunk(idx) {
    var chunk = g_chunkedArray[idx];
    var cmd = path.join(__dirname, "scrapejob.js");
    var job = spawn(cmd, chunk);

    job.on('exit', function(code) {
        console.log('Done scraping job: ' + idx);
    });
}

var g_chunkedArray = [];

function swarm(arrSpecies) {

    var methodsObj = {};
    g_chunkedArray = arrayToChunks(arrSpecies);

    for (var i = 0; i < g_chunkedArray.length; i++) {
        var invoke = (function(i) {
            return function() {
                scrapeChunk(i);
            }
        })(i);
        methodsObj["method" + i] = invoke;

    }

    async.parallel(methodsObj);

}


function arrayToChunks(array) {
    var i, j, temparray, retArray = [],
        chunk = 50;
    for (i = 0, j = array.length; i < j; i += chunk) {
        temparray = array.slice(i, i + chunk);
        retArray.push(temparray);
    }
    return retArray;
}