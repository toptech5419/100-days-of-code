# Crypto Dashboard

A comprehensive dashboard that provides real-time cryptocurrency tracking, weather forecasts, and time zone management with elegant visualizations and user customization.


## Features

### 📊 Cryptocurrency Tracking
- Real-time price data for top cryptocurrencies
- Interactive price charts (24-hour timeline)
- Market cap and 24h percentage change
- Price alert notifications with sound effects
- Customizable cryptocurrency list

### 🌦️ Weather Integration
- Current weather conditions
- 3-day forecast with visual icons
- Multiple predefined city options
- Temperature in Fahrenheit

### ⏰ Time Management
- Live clock with seconds precision
- Multiple time zone support (Local, NYC, London, Tokyo)
- Sleek digital display with text shadow effects

### 🎨 Customization
- Dynamic Unsplash background images (theme-based)
- Light/dark theme toggle
- Adjustable update intervals (5-60 minutes)
- Sound effect controls
- Responsive design for all screen sizes

## Technologies Used

- **Frontend**: HTML5, CSS3 (CSS Variables), JavaScript (ES6+)
- **Charts**: Chart.js with date-fns adapter
- **APIs**:
  - CoinGecko API (cryptocurrency data)
  - OpenWeatherMap API (weather data)
  - Unsplash API (background images)
- **Storage**: LocalStorage for user preferences
- **Animation**: CSS transitions and keyframes

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crypto-dashboard.git
   ```
2. Navigate to project directory:
   ```bash
   cd crypto-dashboard
   ```
3. Open in browser:
   ```bash
   open index.html  # or use your system's equivalent
   ```

## Configuration

### API Keys Setup
1. Get free API keys from:
   - [OpenWeatherMap](https://openweathermap.org/api)
   - [Unsplash](https://unsplash.com/developers)

2. Update API endpoints in `script.js`:
   ```javascript
   // Replace Scrimba proxy URLs with direct API endpoints
   const UNSPLASH_API = `https://api.unsplash.com/photos/random?client_id=YOUR_KEY&query=`;
   const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?appid=YOUR_KEY&units=imperial&`;
   ```

### Custom Settings
Access the settings panel (⚙️) to configure:
- Cryptocurrency watchlist (comma-separated)
- Background image themes (nature, technology, etc.)
- Data refresh interval (5-60 minutes)
- Default weather city
- Theme preferences (light/dark)

## Usage

1. **Cryptocurrency Section**:
   - Select from dropdown list
   - Set price alerts using number input
   - Click refresh button for latest data

2. **Time Section**:
   - Choose time zone from dropdown
   - Automatic seconds update

3. **Weather Section**:
   - Displays current weather for selected city
   - Three-day forecast below current conditions

4. **Background**:
   - Automatically cycles based on theme
   - Credits photographer in bottom-right

## Project Structure

```
crypto-dashboard/
├── index.html         # Main HTML structure
├── styles.css         # Styling and themes
├── script.js          # Core functionality
├── README.md          # Documentation
└── assets/            # (Optional) Local assets
```

## Contributing

1. Fork the project
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- CoinGecko for cryptocurrency data
- OpenWeatherMap for weather data
- Unsplash for beautiful background images
- Chart.js for interactive data visualizations
- Scrimba for API proxy examples

---

**Note**: This project requires an internet connection for real-time data updates. API rate limits may apply with free-tier keys.