const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const STORE = require('../playstore');

describe('GET /apps of Google Play Express Server', () => {
    // VALIDAtiON
    it('Should return a 400 status for any sort other than one of [app, rating]', ()=> {
        return request(app)
                .get('/apps')
                .query({sort: 'title'})
                .expect(400, `Whoops! You can only sort by either "app" or "rating". You tried to sort by "title"`)
    });

    it('Should return a 400 status for any genre other than one of [Action, Puzzle, Strategy, Casual, Arcade, Card]', ()=> {
        return request(app)
                .get('/apps')
                .query({genre: 'Adventure'})
                .expect(400, `Whoops! Searchable genres are: Action, Puzzle, Strategy, Casual, Arcade, and Card. You must choose only one genre. However, you tried to search "Adventure".`)
    });

    // SORT AND GENRE MANAGEMENT
    it('Should return all apps when neither sort nor genre are passed in', ()=> {
        return request(app)
                .get('/apps')
                .query({})
                .expect(200)
                .expect('Content-Type', /json/)
                .then((res)=> {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf(20) // this length would obviously change in a real app.
                });
    });

    it('Should return all apps sorted by rating when sort=rating and no genre is given', ()=> {
        const sort = 'rating';
        const allAppsSortedByRating = STORE.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        }); 
        
        return request(app)
                .get('/apps')
                .query({sort: 'rating'})
                .expect(200)
                .expect('Content-Type', /json/)
                .then((res)=> {
                    expect(res.body).to.eql(allAppsSortedByRating)
                });
    });

    it('Should return all apps sorted by app when sort=app and no genre is given', ()=> {
        const sort = 'app';
        const allAppsSortedByApp = STORE.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        }); 
        
        return request(app)
                .get('/apps')
                .query({sort: 'rating'})
                .expect(200)
                .expect('Content-Type', /json/)
                .then((res)=> {
                    expect(res.body).to.eql(allAppsSortedByApp)
                });
    });

    it('Should return only apps of the Action genre when genre=action, unsorted when no value is passed to sorted', ()=> {
        const allActionGenre = STORE.filter(( app ) => app.Genres.includes('Action')); 
        
        return request(app)
                .get('/apps')
                // TODO: modify server to be case-agnostic.
                .query({genre: 'Action'}) 
                .expect(200)
                .expect('Content-Type', /json/)
                .then((res)=> {
                    expect(res.body).to.eql(allActionGenre)
                });
    });

    it('Should return apps only of the Puzzle genre when genre=puzzle, sorted by rating when sort=rating', ()=> {
        const allPuzzleGenre = STORE.filter(( app ) => app.Genres.includes('Puzzle')); 
        const sort = 'rating';
        const puzzleGenreSortedByRating = allPuzzleGenre.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        }); 
        return request(app)
                .get('/apps')
                // TODO: modify server to be case-agnostic.
                .query({genre: 'Puzzle', rating: 'rating'}) 
                .expect(200)
                .expect('Content-Type', /json/)
                .then((res)=> {
                    expect(res.body).to.eql(puzzleGenreSortedByRating)
                });
    });
})