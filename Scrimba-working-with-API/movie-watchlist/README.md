# Movie Watchlist

## Overview
Movie Watchlist is a web application that allows users to search for movies and TV shows using the TMDB API, view details, watch trailers, and add their favorite titles to a watchlist. The app provides a smooth UI with features like star ratings, responsive design, and theme toggling.

## Features
- **Search Movies & TV Shows**: Search for content using the TMDB API.
- **View Details**: Get information about a movie or TV show, including cast, overview, and release year.
- **Watch Trailers**: Watch official trailers directly from YouTube.
- **Add to Watchlist**: Save your favorite titles in the browser's local storage.
- **Responsive Design**: Works across all devices.
- **Dark/Light Mode**: Toggle between themes for a better viewing experience.

## Technologies Used
- HTML, CSS, JavaScript
- TMDB API for movie data
- Local Storage for watchlist management
- FontAwesome for icons

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/toptech5419/100-days-of-code.git
   cd movie-watchlist
   ```
2. Open `index.html` in a browser.
3. Ensure you have an active internet connection to fetch data from TMDB.

## Usage
- Enter a movie or TV show name in the search bar and click the search button.
- Click on a movie card to view its details.
- Click the "Play" button to watch the trailer.
- Click "Add to Watchlist" to save a title.
- Click on the theme toggle button to switch between light and dark mode.

## API Key
This project uses The Movie Database (TMDB) API. To use your own API key:
1. Get an API key from [TMDB](https://www.themoviedb.org/documentation/api).
2. Replace the `API_KEY` variable in `script.js` and `details.js` with your own key.

```javascript
const API_KEY = 'your_api_key_here';
```

## Future Improvements
- User authentication for personalized watchlists
- Pagination for search results
- Improved UI/UX with animations and transitions

## License
This project is open-source and available under the MIT License.
