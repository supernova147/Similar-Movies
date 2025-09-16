//need an event listener to listen for the submit button, then fire off a function that checks if the info is good, then sends it to node.js.
// that way node.js can use the user's input
const submitButton = document.getElementById('submit_button');
let user_input = '';
const results = document.getElementById('movie_container');

function searchResult(event) {
    event.preventDefault();
    const input = document.getElementById('form_input').value;

    if (input !== "" && input.length > 1) { //if the user's input is NOT less than two or empty, we will then search for that movie & return that data to the backend.
        user_input = input;
        console.log('returning information to backend');

        fetch('/movies/search', {
            method: 'POST', 
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ input: user_input}) //converting the user input to a string value so the backend can 'see' it
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            renderMovies(data); 
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
        } else {
            console.log("Invalid Input");
        }
}

submitButton.addEventListener('click', searchResult) 

function renderMovies(movie) { //Rendering the movies found within the similar API results
    results.innerHTML = '';
    movie.forEach(m => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML =
        `
        ${m.poster_url ? `<img src="${m.poster_url}" alt="${m.title || 'Movie poster'}">` : ''}
        <h3>${m.title || 'Untitled'}</h3>
        <p>${m.overview || ''}</p>
    `;
    results.appendChild(card);
    });
}