// CREATE SERVER, GET DATA FOR SERVING, AND SET UP LOGGING
const express = require('express');
const morgan = require('morgan');
const apps = require('./playstore');

const app = express();
app.use(morgan('common'));

// SET UP ENDPOINT: /apps
app.get('/apps', (req, res) => {
    const { sort, genre } = req.query;

    // validation of optional params
    if ( sort ) {
        const allowableSorts = ['rating', 'app'];
        if ( !allowableSorts.includes( sort )) {
            return res
                    .status('400')
                    .send(`Whoops! You can only sort by either "app" or "rating". You tried to sort by "${ sort }"`)
        }
    }

    if ( genre ) {
        const allowableGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
        if ( !allowableGenres.includes( genre )) {
            return res
                    .status('400')
                    .send(`Whoops! Searchable genres are: Action, Puzzle, Strategy, Casual, Arcade, and Card. You must choose only one genre. However, you tried to search "${ genre }".`)
        }
    }

    // Prepare results
    let results;

    // if a genre was requested, filter for it; otherwise, return all apps.
    if ( genre ) {
        results = apps
                    .filter( app => 
                                app
                                   .Genres
                                   .includes( genre )
                    );
    } else {
        results = apps;
    }

    // if a sort was specified, sort results.
    if ( sort ) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        }); 
    }

    res
        .json(results);
});

module.exports = app;