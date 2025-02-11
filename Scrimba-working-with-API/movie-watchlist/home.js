const API_KEY = '02c8b6585349fe3b67ffeef66d0b4d64';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const movieGrid = document.querySelector('.movie-grid');
const loadingContainer = document.querySelector('.loading-container');

// Initialize
let currentPage = 1;
let totalPages = 1;

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Search Handler
function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    showLoading();
    // clearMovies();
    searchMovies(query)
        .then(displayMovies)
        .catch(handleError)
        .finally(hideLoading);
}

// TMDB API Functions
async function searchMovies(query) {
    try {
        const response = await fetch(
            `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`
        );
        const data = await response.json();
        totalPages = data.total_pages;
        return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    } catch (error) {
        throw new Error('Failed to fetch content');
    }
}

// Display Movies
function displayMovies(movies) {
    if (!movies.length) {
        movieGrid.innerHTML = '<p class="no-results">No movies found. Try another search!</p>';
        return;
    }

    const movieCards = movies.map(movie => createMovieCard(movie));
    movieGrid.append(...movieCards);
    movieGrid.scrollIntoView({ behavior: 'smooth' });

    // Hide empty state
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) emptyState.style.display = 'none';
}

// Create Movie Card Element
function createMovieCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.mediaType = item.media_type;
    card.dataset.mediaId = item.id;
    
    // Determine media type and content
    const isTV = item.media_type === 'tv';
    const title = isTV ? item.name : item.title;
    const date = isTV ? item.first_air_date : item.release_date;
    const year = date ? date.split('-')[0] : 'Unknown year';

    card.innerHTML = `
        <div class="media-tag ${item.media_type}">${isTV ? 'Series' : 'Movie'}</div>
        <div class="poster-container">
            <div class="poster-loader"></div>
            <img src="${IMAGE_BASE_URL}${item.poster_path}" alt="${title}" 
                 class="movie-poster" 
                 onload="this.style.opacity = 1; this.previousElementSibling.style.display = 'none'">
        </div>
        <div class="movie-info">
            <h3>${title}</h3>
            <div class="rating-stars">
                ${generateStarRating(item.vote_average / 2)}
            </div>
            <p>${year}</p>
            ${item.overview ? `<p class="movie-overview">${item.overview.substring(0, 100)}...</p>` : ''}
            <button class="view-details">
                <i class="fas fa-info-circle"></i>
                View Details
            </button>
        </div>
    `;

    // Add click handler to entire card
    card.addEventListener('click', function(event) {
        // Prevent button click from triggering both events
        if (!event.target.closest('.view-details')) {
            handleViewDetails(item.media_type, item.id);
        }
    });
    
    // Add click handler to view details button
    card.querySelector('.view-details').addEventListener('click', () => {
        handleViewDetails(item.media_type, item.id);
    });

    return card;
}

// Star Rating Generator
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Loading States
function showLoading() {
    loadingContainer.style.display = 'flex';
    movieGrid.innerHTML = '';
}

function hideLoading() {
    loadingContainer.style.display = 'none';
}

// Error Handling
function handleError(error) {
    movieGrid.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${error.message}</p>
        </div>
    `;
}

// Placeholder for future implementation
function handleViewDetails(mediaType, mediaId) {
    window.location.href = `./details/details.html?type=${mediaType}&id=${mediaId}`;
}

function toggleTheme(){
const themeToggle = document.querySelector('.theme-toggle');
        const body = document.documentElement;

        themeToggle.addEventListener('click', () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeToggle.innerHTML = isDark 
                ? '<i class="fas fa-moon"></i>' 
                : '<i class="fas fa-sun"></i>';
        });
    }
    toggleTheme();