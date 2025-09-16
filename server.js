// Calling all necessary modules 
const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const path = require('path');
require('dotenv').config();  

const TMDB_TOKEN = process.env.API_READ_ACCESS_TOKEN; //Grabbing the API token so that it can be used securely from .env

const app = express(); //instantiating an instance of express; saving it to the app variable
const PORT = process.env.PORT || 3000; //Grabbing the PORT # from .env

app.use(cors()); 
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'))); //build pathway to find folder

app.post('/movies/search', (req, res) => {
    const userMovie = String(req.body?.input || '').trim(); //getting the user's input from the front end.
    let userMovieID = ''; //setting default value for ID
// Using userMovie to find userMovieID so that we can put the ID into the 'similar' API endpoint
const url = `https://api.themoviedb.org/3/search/movie?query=${userMovie}&include_adult=false&language=en-US&page=1&year=2025`; 
const options = {
        method: 'GET',
        headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
    }
};
//Using the userMovieID, we then use it to find 'similar' movies
fetch(url, options)
    .then(r => r.json())
    .then(json => {
        console.log(json.results[0].id)
        console.log(json.results[0].release_date)
        console.log(json.results[0].title)
        console.log(json.results[0].poster_path)  
        
        userMovieID = json.results[0].id; //Taking the userMovieID from the first result.
        
        const url_similar = `https://api.themoviedb.org/3/movie/${userMovieID}/similar?language=en-US&page=1&year=2025`; //Inserting it in the similar API to find similar options.
        const options_similar = {
                method: 'GET',
                headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
            }
        };

    return fetch(url_similar, options_similar)
        .then(r2 => r2.json())
        .then(json => {
            const movieList = (json.results || []) //Creating a var to capture the results found in similar movies.
            .slice(0, 6)   
    .map(movie => ({
        id: movie.id, //the movie's ID
        title: movie.title, //title of the movie.
        poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null, // the image for the movie
        overview: movie.overview //description for movie!
    }));
        console.log('Movies:', movieList);
        return res.json(movieList); // returning the movieList
    })
        .catch(err => console.error(err));
    });
});

app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`);
});
