document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResultsDiv = document.getElementById('search-results');
  const API_KEY = '4b28f7e0';  // Your OMDb API key

  // Debounce function for better performance
  const debounce = (fn, delay) => {
      let timeout;
      return function (...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => fn.apply(this, args), delay);
      };
  };

  // Search function
  const searchMovies = async (searchTerm) => {
      try {
          if (!searchTerm) {
              searchResultsDiv.innerHTML = '<p class="error">Please enter a movie name</p>';
              return;
          }

          // Fetch data from OMDb API
          const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`);
          const data = await response.json();

          // Clear previous results
          searchResultsDiv.innerHTML = '';

          if (data.Response === "False") {
              searchResultsDiv.innerHTML = `<p class="error">No results found for "${searchTerm}"</p>`;
              return;
          }

          // Render results
          data.Search.forEach(async (movie) => {
              const movieDetailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
              const movieDetails = await movieDetailsResponse.json();

              const card = `
                  <div class="movie-card">
                      <h3>${movieDetails.Title}</h3>
                      <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
                      <p><strong>Director:</strong> ${movieDetails.Director}</p>
                      <p><strong>Genre:</strong> ${movieDetails.Genre}</p>
                      <p><strong>Year:</strong> ${movieDetails.Year}</p>
                  </div>
              `;
              searchResultsDiv.innerHTML += card;
          });

      } catch (error) {
          console.error('Error:', error);
          searchResultsDiv.innerHTML = '<p class="error">Failed to load results</p>';
      }
  };

  // Event listeners
  searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.trim();
      searchMovies(searchTerm);
  });

  // Add keyboard listener for Enter key
  searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          searchButton.click();
      }
  });

  // Add debounced input listener
  searchInput.addEventListener('input', debounce((e) => {
      const searchTerm = e.target.value.trim();
      if (searchTerm.length > 2) {
          searchMovies(searchTerm);
      } else {
          searchResultsDiv.innerHTML = '';
      }
  }, 300));
});
