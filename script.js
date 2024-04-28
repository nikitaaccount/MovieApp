const API_KEY = config.apiKey|| process.env.apiKey;
const BASE_URL = 'https://api.themoviedb.org/3';
const SEARCH_URL = `${BASE_URL}/search/movie`;
const POPULAR_MOVIES_URL = `${BASE_URL}/movie/popular`;

let currentPage = 1;
let totalPages = 1;
let currentSearchQuery = '';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const moviesContainer = document.getElementById('moviesContainer');
const loadMoreButton = document.getElementById('loadMoreButton');

// Event listeners
searchButton.addEventListener('click', handleSearch);
loadMoreButton.addEventListener('click', handleLoadMore);


// Function to fetch movies from TMDB API
async function fetchMovies(query, page) {
    const url = query ? `${SEARCH_URL}?api_key=${API_KEY}&query=${query}&page=${page}` : `${POPULAR_MOVIES_URL}?api_key=${API_KEY}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPages = data.total_pages;
        return data.results;
    }
     catch (error) {
        console.error('Error fetching movies:', error.message);
        console.log("error");
    }
}

// Function to display movies
function displayMovies(movies) {
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <p>Release Date:<span>${movie.release_date}</span></p>
            <p>Rating: <span>${movie.vote_average} </span></p>
        `;
        moviesContainer.appendChild(movieElement);
        movieElement.addEventListener('click', movieDetails(movie.overview));
       
    });

    if (currentPage < totalPages) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }

}

// Function to handle search
async function handleSearch() {
    currentPage = 1;
    currentSearchQuery = searchInput.value.trim();
    moviesContainer.innerHTML = ''; 
    const movies = await fetchMovies(currentSearchQuery, currentPage);
    displayMovies(movies);
}

// Function to handle load more button click
async function handleLoadMore() {
    currentPage++;
    const movies = await fetchMovies(currentSearchQuery, currentPage);
    displayMovies(movies);
}

// Function to get more details of the movie
var movieDetails = function(details) {
    return function curried_func(e) {
      this.textContent = details;
      this.style.color ="#000060";
      this.style.fontSize = "20px";
    }
}

// Initial load
window.onload = handleSearch;