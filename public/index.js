const API_KEY = '4b28f7e0'; // Your OMDb API Key

// Function to search movies
function searchMovie() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert('Please enter a movie name');
        return;
    }

    fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = '';

            if (data.Response === "True" && data.Search) {
                data.Search.forEach(movie => {
                    fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
                        .then(response => response.json())
                        .then(details => {
                            const movieElement = document.createElement('div');
                            movieElement.classList.add('movie-card');

                            movieElement.innerHTML = `
                                <img src="${details.Poster !== "N/A" ? details.Poster : 'placeholder.jpg'}" alt="${details.Title}">
                                <h3>${details.Title}</h3>
                                <p><strong>Director:</strong> ${details.Director || 'N/A'}</p>
                                <p><strong>Genre:</strong> ${details.Genre || 'N/A'}</p>
                                <p><strong>Year:</strong> ${details.Year}</p>
                                <button class="watchlist-btn" onclick="addToWatchlist('${details.imdbID}')">Add to Watchlist</button>
                            `;
                            resultsDiv.appendChild(movieElement);
                        });
                });
            } else {
                resultsDiv.innerHTML = `<p>No movies found. Try another search.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
            alert('Failed to fetch movie data. Please try again.');
        });
}

// Function to add movie to watchlist
function addToWatchlist(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(movie => {
            let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

            // Check if movie is already in the watchlist
            if (watchlist.some(item => item.imdbID === movie.imdbID)) {
                alert('Movie is already in the watchlist!');
                return;
            }

            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));

            alert(`${movie.Title} added to Watchlist!`);
        })
        .catch(error => console.error('Error adding to watchlist:', error));
}

// Function to display watchlist on watchlist page
function displayWatchlist() {
    const watchlistDiv = document.getElementById('watchlist-results');
    watchlistDiv.innerHTML = '';

    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (watchlist.length === 0) {
        watchlistDiv.innerHTML = `<p>Your watchlist is empty.</p>`;
        return;
    }

    watchlist.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card');

        movieElement.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
            <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <button class="remove-btn" onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>
        `;
        watchlistDiv.appendChild(movieElement);
    });
}

// Function to remove movie from watchlist
function removeFromWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}

// Ensure functions run when the page loads
document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    if (searchBtn) searchBtn.addEventListener('click', searchMovie);
    if (searchInput) searchInput.addEventListener('keypress', function (event) {
        if (event.key === "Enter") {
            searchMovie();
        }
    });

    if (window.location.pathname.includes("watchlist.html")) {
        displayWatchlist();
    }
});
