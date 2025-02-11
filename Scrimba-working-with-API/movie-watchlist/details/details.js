const API_KEY = '02c8b6585349fe3b67ffeef66d0b4d64';
const params = new URLSearchParams(window.location.search);
const mediaType = params.get('type');
const mediaId = params.get('id');

// DOM Elements
const backBtn = document.getElementById('backBtn');
const trailerModal = document.getElementById('trailerModal');
const trailerContainer = document.getElementById('trailerContainer');
const closeBtn = document.querySelector('.close-btn');

// Initialize page
loadDetails();

// Load movie details
async function loadDetails() {
    try {
        // Fetch movie details
        const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${API_KEY}&append_to_response=credits,videos`
        );
        const detailsData = await detailsResponse.json();

        // Fetch configuration for image URLs
        const configResponse = await fetch(
            `https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`
        );
        const configData = await configResponse.json();

        // Build movie details
        const container = document.getElementById('details-container');
        container.innerHTML = `
            <div class="poster-container">
                <img src="${configData.images.secure_base_url}w1280${detailsData.poster_path}" 
                     class="movie-poster" 
                     alt="${detailsData.title || detailsData.name}">
            </div>
            
            <h1 class="movie-title">${detailsData.title || detailsData.name}</h1>
            
            <div class="movie-meta">
                <span class="meta-item">
                    <i class="fas fa-clock"></i>
                    ${mediaType === 'movie' ? 
                        `${Math.floor(detailsData.runtime / 60)}h ${detailsData.runtime % 60}m` : 
                        `${detailsData.number_of_seasons} seasons`}
                </span>
                <span class="meta-item">|</span>
                <span class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    ${(detailsData.release_date || detailsData.first_air_date).split('-')[0]}
                </span>
                <span class="meta-item">|</span>
                <span class="meta-item">
                    <i class="fas fa-tag"></i>
                    ${detailsData.genres.slice(0, 3).map(g => g.name).join(', ')}
                </span>
            </div>

            <div class="play-btn-container">
                <button class="play-btn" id="playBtn">
                    <i class="fas fa-play"></i>
                </button>
            </div>

            <p class="movie-description">${detailsData.overview}</p>

            <div class="cast-container">
                ${detailsData.credits.cast.slice(0, 6).map(artist => `
                    <div class="artist-card">
                        <img src="${artist.profile_path ? 
                            configData.images.secure_base_url + 'w185' + artist.profile_path : 
                            'https://via.placeholder.com/185x278?text=No+Image'}" 
                             class="artist-image" 
                             alt="${artist.name}">
                        <p>${artist.name}</p>
                        <small>${artist.character}</small>
                    </div>
                `).join('')}
            </div>

            <button class="add-to-watchlist" id="addToWatchlist">
                <i class="fas fa-plus"></i> Add to Watchlist
            </button>
        `;

        // Add event listeners
        document.getElementById('playBtn').addEventListener('click', () => {
            const trailer = detailsData.videos.results.find(v => v.type === 'Trailer');
            if (trailer) {
                showTrailer(trailer.key);
            }
        });

        document.getElementById('addToWatchlist').addEventListener('click', addToWatchlist);

    } catch (error) {
        console.error('Error loading details:', error);
        const container = document.getElementById('details-container');
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading movie details. Please try again later.</p>
            </div>
        `;
    }
}

// Show trailer modal
function showTrailer(key) {
    // Clear previous iframe
    trailerContainer.innerHTML = '';

    // Create new iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${key}`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');

    // Append iframe
    trailerContainer.appendChild(iframe);

    // Show modal
    trailerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Show close button
    closeBtn.style.display = 'block';

    // Close modal when clicking outside
    trailerModal.addEventListener('click', (e) => {
        if (e.target === trailerModal) {
            closeTrailer();
        }
    });

    // Add keyboard escape listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTrailer();
        }
    });
}

// Close trailer modal
function closeTrailer() {
    // Pause video
    const iframe = trailerContainer.querySelector('iframe');
    if (iframe) iframe.src = '';

    // Hide modal
    trailerModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Hide close button
    closeBtn.style.display = 'none';

    // Cleanup
    trailerContainer.innerHTML = '';
}

// Add to watchlist functionality
function addToWatchlist() {
    const movieData = {
        id: mediaId,
        type: mediaType,
        title: document.querySelector('.movie-title').textContent,
        poster: document.querySelector('.movie-poster').src
    };
    
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (!watchlist.some(item => item.id === mediaId)) {
        watchlist.push(movieData);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Added to watchlist!');
    } else {
        alert('Already in watchlist!');
    }
    window.history.back();
}

// Back button functionality
backBtn.addEventListener('click', () => {
    window.history.back();
});

// Close button functionality
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    closeTrailer();
});