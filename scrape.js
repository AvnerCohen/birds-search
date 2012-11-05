// This job will be reposible for scraping the birds list of the israbirding.com site.
// Once scraped, it will spawn a number of child process (based on number of cpus?) to scrape
// Wikipedia for the pages of each of the species.
var nodeio = require('node.io');

nodeio.scrape(function() {
    this.getHtml('http://israbirding.com/checklist/', function(err, $) {
        var species = [];

        $('#main_list tr td.en').each(function(bird_species) {
            species.push(parseSpeciesName(bird_species.text));
        });
        this.emit(species);
    });
});

function parseSpeciesName(orig) {

    return (orig.replace(/\ /g, "_"));
}

//Now, scrape the wiki page and save each on to birds-kb spot:
//http://en.wikipedia.org/wiki/xxxxx