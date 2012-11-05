#! /usr/bin/env node

var nodeio = require('node.io');
var options = {
    timeout: 1,
    max: 20
};
var fs = require('fs');
//var species = process.argv[2].split(",");
var species  =[ 'Ostrich',
  'Red-throated_Loon',
  'Black-throated_Loon',
  'Horned_Grebe',
  'Black-necked_Grebe',
  'Little_Grebe',
  'Great_Crested_Grebe',
  'Red-necked_Grebe',
  'Shy_Albatross',
  'Atlantic_Petrel',
  'Fea\'s_Petrel',
  'Soft-plumaged_Petrel',
  'Cory\'s_Shearwater',
  'Streaked_Shearwater',
  'Flesh-footed_Shearwater',
  'Sooty_Shearwater',
  'Great_Shearwater',
  'Little_Shearwater',
  'Audubon\'s_Shearwater',
  'Balearic_Shearwater',
  'Yelkouan_Shearwater',
  'European_Storm-Petrel',
  'Wilson\'s_Storm-Petrel',
  'Leach\'s_Storm-Petrel',
  'Madeiran_Storm-Petrel',
  'Swinhoe\'s_Storm-Petrel',
  'Red-billed_Tropicbird',
  'Northern_Gannet',
  'Brown_Booby',
  'Masked_Booby',
  'European_Shag',
  'Great_Cormorant',
  'Pygmy_Cormorant',
  'Lesser_Frigatebird',
  'African_Darter',
  'White_Pelican',
  'Dalmatian_Pelican',
  'Pink-backed_Pelican',
  'Great_Bittern',
  'Little_Bittern',
  'Black-crowned_Night_Heron',
  'Mangrove_Heron',
  'Intermediate_Egret',
  'Cattle_Egret',
  'Squacco_Heron',
  'Little_Egret',
  'Western_Reef_Heron',
  'Great_Egret',
  'Grey_Heron',
  'Purple_Heron',
  'Goliath_Heron',
  'Black_Heron',
  'Black-headed_Heron',
  'Marabou_Stork',
  'Yellow-billed_Stork',
  'White_Stork',
  'Black_Stork',
  'Glossy_Ibis',
  'Northern_Bald_Ibis',
  'Eurasian_Spoonbill',
  'Greater_Flamingo',
  'Lesser_Flamingo',
  'Mute_Swan',
  'Whooper_Swan',
  'Tundra_Swan',
  'Greater_White-fronted_Goose',
  'Lesser_White-fronted_Goose',
  'Greylag_Goose',
  'Bean_Goose',
  'Red-breasted_Goose',
  'Lesser_Whistling_Duck',
  'Egyptian_Goose',
  'Common_Shelduck',
  'Ruddy_Shelduck',
  'Mallard',
  'Gadwall',
  'Northern_Pintail',
  'Northern_Shoveler',
  'Eurasian_Wigeon',
  'Common_Teal',
  'Cape_Teal',
  'Red-billed_Teal',
  'Garganey',
  'Marbled_Duck',
  'Common_Pochard',
  'Red-crested_Pochard',
  'Southern_Pochard',
  'Ferruginous_Duck',
  'Greater_Scaup',
  'Tufted_Duck',
  'Common_Eider',
  'Velvet_Scoter',
  'Long-tailed_Duck',
  'Common_Goldeneye',
  'Smew',
  'Goosander',
  'Red-breasted_Merganser',
  'White-headed_Duck',
  'Lammergeier',
  'Eurasian_Griffon_Vulture' ];


function scrapeWikiPage(idx) {
    var species_name = species[idx];
    console.log(species_name + "::Scraping");
    nodeio.scrape((function(name) {
        return function() {
            console.log(name + "::FuncInvoked");
            this.get('http://en.wikipedia.org/wiki/' + name, function(err, data) {
                console.log(name + "::DataRecevied");

                if (err) {
                    saveToDisk("error" + name, err);
                } else {
                    saveToDisk(name, data);
                }

            });
        };
    })(species_name));

}

function saveToDisk(species_name, data) {
    console.log(species_name + "::Saving");
    fs.writeFile("./birds-kb/" + species_name + "_data.txt", data, function(err) {
        if (err) {
            console.log(err);
        };
    });
}

function doIt() {
    for (var i = 0; i < species.length; i++) {
        scrapeWikiPage(i);

    }
}

doIt();