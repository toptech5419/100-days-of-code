// DOM Elements
const watchlistContainer = document.getElementById('watchlistContainer');
const removeAllBtn = document.getElementById('removeAllBtn');
const backBtn = document.getElementById('backBtn');

// Initialize
document.addEventListener('DOMContentLoaded', loadWatchlist);

// Event Listeners
backBtn.addEventListener('click', () => window.history.back());
removeAllBtn.addEventListener('click', handleRemoveAll);

function loadWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  
  if (watchlist.length === 0) {
    showEmptyState();
    return;
  }

  watchlistContainer.innerHTML = watchlist
    .map(movie => createMovieCard(movie))
    .join('');
  
  addRemoveListeners();
}

function createMovieCard(movie) {
  return `
    <div class="movie-card" data-id="${movie.id}">
      <img src="${movie.poster}" 
           class="movie-poster" 
           alt="${movie.title} poster"
           onerror="this.src='https://via.placeholder.com/300x450?text=Poster+Not+Available'">
      
      <h3 class="movie-title">${movie.title}</h3>
      
      <div class="streaming-platforms">
        <a href="https://netflix.com" target="_blank" class="platform-link">
          <i class="fab fa-netflix"></i>
        </a>
        <a href="https://hulu.com" target="_blank" class="platform-link">
          <i class="fab fa-hulu"></i>
        </a>
        <a href="https://primevideo.com" target="_blank" class="platform-link">
          <i class="fab fa-amazon"></i>
        </a>
        <a href="https://disneyplus.com" target="_blank" class="platform-link">
          <i class="fab fa-disney"></i>
        </a>
      </div>
      
      <button class="btn remove-btn">
        <i class="fas fa-times-circle"></i>
        Remove
      </button>
    </div>
  `;
}

function addRemoveListeners() {
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', handleRemoveMovie);
  });
}

function handleRemoveMovie(event) {
  const card = event.target.closest('.movie-card');
  const movieId = card.dataset.id;
  
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist = watchlist.filter(movie => movie.id !== movieId);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  
  card.remove();
  if (watchlist.length === 0) showEmptyState();
}

function handleRemoveAll() {
  localStorage.removeItem('watchlist');
  watchlistContainer.innerHTML = '';
  showEmptyState();
}

function showEmptyState() {
  watchlistContainer.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-film"></i>
      <h2>Your watchlist is empty</h2>
      <p>Start adding movies from the homepage!</p>
    </div>
  `;
}