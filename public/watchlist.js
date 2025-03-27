document.addEventListener("DOMContentLoaded", () => {
    const watchlistContainer = document.getElementById("watchlist-results");

    function loadWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

        if (watchlist.length === 0) {
            watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
            return;
        }

        watchlistContainer.innerHTML = "";
        watchlist.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            movieCard.innerHTML = `
                <h3>${movie.Title}</h3>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <img src="${movie.Poster}" alt="${movie.Title}">
                <button class="remove-btn" data-id="${movie.imdbID}">Remove</button>
            `;

            watchlistContainer.appendChild(movieCard);
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                removeFromWatchlist(this.getAttribute("data-id"));
            });
        });
    }

    function removeFromWatchlist(movieID) {
        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        watchlist = watchlist.filter(movie => movie.imdbID !== movieID);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        loadWatchlist();
    }

    loadWatchlist();
});
