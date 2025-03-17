# TravelPlanner

**TravelPlanner** is a modern web application designed to simplify trip planning. Users can search for flights, find hotel recommendations, check weather forecasts, and explore their destinations via an interactive map—all in one place. Built with a responsive frontend and integrated with powerful APIs, it offers a seamless experience for travelers.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)  
![Version](https://img.shields.io/badge/version-1.0.0-blue)  
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [TravelPlanner](#travelplanner)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [API Keys](#api-keys)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)
  - [Contact](#contact)

---

## Installation

Follow these steps to set up TravelPlanner locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/toptech5419/100-days-of-code
   naviagate to plan-it-here-main.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd plan-it-here-main
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Usage

To run and explore the application:

1. **Start the development server**:
   ```bash
   npm run dev
   ```
2. **Open your browser** and visit `http://localhost:5173` (or the port displayed in your terminal).
3. **Interact with the app**:
   - Input your travel details (origin, destination, dates) on the homepage.
   - Browse flight options, hotel suggestions, weather data, and an interactive map on the results page.

---

## Configuration

TravelPlanner relies on external APIs, requiring environment variables for configuration:

1. **Create a `.env` file** in the project root.
2. Add the following variables:
   ```env
   VITE_AMADEUS_CLIENT_ID=your_amadeus_client_id
   VITE_AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   ```
3. Replace the placeholders with your actual API credentials (see [API Keys](#api-keys) for details).

---

## API Keys

To enable flight, hotel, and weather features, you’ll need API keys from the following services:

- **Amadeus API**:
  - Register at [Amadeus for Developers](https://developers.amadeus.com/).
  - Create an app to obtain your `client_id` and `client_secret`.
- **OpenWeatherMap API**:
  - Sign up at [OpenWeatherMap](https://openweathermap.org/).
  - Generate an API key from your account dashboard.

---

## Features

- **Flight Search**: Discover flight options based on your travel preferences.
- **Hotel Recommendations**: View hotels in your destination with details like ratings and pricing.
- **Weather Forecast**: Check current weather conditions for your travel location.
- **Interactive Map**: Explore your destination using a dynamic map interface.

---

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Vite (build tool)
  - Tailwind CSS (styling)
  - React Router (navigation)
- **APIs**:
  - Amadeus API (flights and hotels)
  - OpenWeatherMap API (weather)
- **Libraries**:
  - Leaflet (interactive maps)
  - Lucide React (icons)

---

## Contributing

We’d love your help to improve TravelPlanner! Here’s how to contribute:

1. **Fork the repository**.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Describe your changes here"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Submit a pull request** on GitHub.

Please adhere to our [contribution guidelines](CONTRIBUTING.md) and include tests where applicable.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

## Acknowledgements

- [Amadeus](https://developers.amadeus.com/) for flight and hotel data.
- [OpenWeatherMap](https://openweathermap.org/) for weather information.
- [Leaflet](https://leafletjs.com/) for mapping capabilities.
- [Lucide React](https://lucide.dev/) for beautiful icons.
- Gratitude to the open-source community and all contributors!

---

## Contact

Have questions or feedback? Contact us at [alabitemitope51@gmail.com](mailto:alabitemitope51@gmail.com) or file an issue on [GitHub](https://github.com/toptech5419/100-days-of-code/issues).

