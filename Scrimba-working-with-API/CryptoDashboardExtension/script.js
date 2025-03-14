const defaultSettings = {
  cryptoList: ['bitcoin', 'solana', 'ethereum'],
  unsplashTheme: 'nature',
  updateInterval: 5,
  weatherCity: 'New York',
  soundEffects: true
};

let settings = { ...defaultSettings };
let alerts = JSON.parse(localStorage.getItem('alerts')) || {};
let cryptoChart;
let isLoading = false;

const cityCoordinates = {
  'New York': { lat: 40.7128, lon: -74.0060 },
  'London': { lat: 51.5074, lon: -0.1278 },
  'Tokyo': { lat: 35.6895, lon: 139.6917 }
};

const sounds = {
  click: new Audio('button-1.mp3'),
  alert: new Audio('bell-ringing-05.mp3')
};

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadTheme();
  updateCryptoDropdown();
  setBackground();
  updateCryptoData(); // Initial load
  updateWeather();
  updateTime();
  setUpdateInterval();
  setInterval(updateTime, 1000);

  // Event listeners
  const cryptoSelect = document.getElementById('crypto-select');
  cryptoSelect.addEventListener('change', (e) => {
    console.log('Dropdown changed to:', e.target.value);
    updateCryptoData();
  });
  document.getElementById('refresh-crypto').addEventListener('click', debounce(refreshCryptoData, 1000));
  document.getElementById('time-zone').addEventListener('change', updateTime);
  document.getElementById('set-alert').addEventListener('click', setAlert);
  document.querySelector('.settings-icon').addEventListener('click', toggleSettings);
  document.querySelector('.close-settings').addEventListener('click', toggleSettings);
  document.getElementById('save-settings').addEventListener('click', saveSettings);
  document.getElementById('dark-theme').addEventListener('change', (e) => {
    document.body.classList.toggle('dark', e.target.checked);
    localStorage.setItem('darkTheme', e.target.checked);
  });
  document.getElementById('retry').addEventListener('click', () => {
    document.querySelector('.error-overlay').style.display = 'none';
    updateCryptoData();
    updateWeather();
    setBackground();
  });
});

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function toggleSettings() {
  const panel = document.querySelector('.settings-panel');
  panel.classList.toggle('show');
  const icon = document.querySelector('.settings-icon');
  icon.style.display = panel.classList.contains('show') ? 'none' : 'block';
}

async function fetchBackground() {
  try {
    const response = await fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${settings.unsplashTheme}`);
    if (!response.ok) throw new Error('Failed to fetch background');
    const data = await response.json();
    return {
      url: data.urls.full,
      photographer: data.user.name,
      link: data.user.links.html
    };
  } catch (error) {
    console.error('Background fetch error:', error);
    showError('Failed to load background image');
    return null;
  }
}

async function setBackground() {
  const bg = await fetchBackground();
  if (bg) {
    const currentBg = document.querySelector('.background.current');
    const nextBg = document.querySelector('.background.next');
    nextBg.style.backgroundImage = `url(${bg.url})`;
    nextBg.style.opacity = 1;
    currentBg.style.opacity = 0;
    setTimeout(() => {
      currentBg.classList.remove('current');
      nextBg.classList.remove('next');
      currentBg.classList.add('next');
      nextBg.classList.add('current');
      document.querySelector('.credit a').textContent = bg.photographer;
      document.querySelector('.credit a').href = bg.link;
    }, 1000); // 1-second transition
  }
}

async function fetchCryptoData(coinId) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    if (!response.ok) throw new Error(`Failed to fetch data for ${coinId}`);
    const data = await response.json();
    console.log(`Raw API response for ${coinId}:`, data); // Debugging
    return {
      name: data.name,
      price: data.market_data.current_price.usd,
      change: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd
    };
  } catch (error) {
    console.error(`Error fetching data for ${coinId}:`, error);
    showError(`Failed to load data for ${coinId}. Check your connection or try again.`);
    return null;
  }
}

async function fetchCryptoChart(coinId) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`);
    if (!response.ok) throw new Error(`Failed to fetch chart data for ${coinId}`);
    const data = await response.json();
    return data.prices.map(price => ({ x: new Date(price[0]), y: price[1] }));
  } catch (error) {
    console.error(`Error fetching chart for ${coinId}:`, error);
    showError(`Failed to load chart data for ${coinId}`);
    return null;
  }
}

async function updateCryptoData() {
  if (isLoading) return;
  isLoading = true;
  showLoading();

  const coinId = document.getElementById('crypto-select').value.toLowerCase();
  console.log('Fetching data for:', coinId);

  const data = await fetchCryptoData(coinId);
  if (data) {
    try {
      console.log('Updating UI with:', data);
      document.getElementById('crypto-name').textContent = data.name || 'Unknown';
      document.getElementById('crypto-price').textContent = data.price ? `$${data.price.toLocaleString()}` : 'N/A';
      document.getElementById('crypto-change').textContent = data.change ? `24h: ${data.change.toFixed(2)}%` : 'N/A';
      document.getElementById('crypto-market-cap').textContent = data.marketCap ? `Market Cap: $${data.marketCap.toLocaleString()}` : 'N/A';
    } catch (error) {
      console.error('Error updating crypto UI:', error);
      showError('Failed to update crypto data display');
    }

    if (alerts[coinId] && data.price >= alerts[coinId]) {
      if (Notification.permission === 'granted') {
        new Notification(`Alert: ${data.name} has reached $${data.price}`);
      }
      if (settings.soundEffects) sounds.alert.play();
      delete alerts[coinId];
      localStorage.setItem('alerts', JSON.stringify(alerts));
    }

    const chartData = await fetchCryptoChart(coinId);
    if (chartData) {
      try {
        const ctx = document.getElementById('crypto-chart').getContext('2d');
        if (cryptoChart) cryptoChart.destroy();
        cryptoChart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [{
              label: 'Price (USD)',
              data: chartData,
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour'
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error updating chart:', error);
        showError('Failed to update price chart');
      }
    }
  } else {
    console.log(`No data returned for ${coinId}`);
    document.getElementById('crypto-name').textContent = 'Data Unavailable';
    document.getElementById('crypto-price').textContent = 'N/A';
    document.getElementById('crypto-change').textContent = 'N/A';
    document.getElementById('crypto-market-cap').textContent = 'N/A';
  }
  hideLoading();
  isLoading = false;
}

function refreshCryptoData() {
  if (settings.soundEffects) sounds.click.play();
  updateCryptoData();
}

function updateCryptoDropdown() {
  const select = document.getElementById('crypto-select');
  select.innerHTML = '';
  settings.cryptoList.forEach(coin => {
    const option = document.createElement('option');
    option.value = coin.toLowerCase();
    option.textContent = coin.charAt(0).toUpperCase() + coin.slice(1);
    select.appendChild(option);
  });
  select.value = settings.cryptoList[0].toLowerCase();
  updateCryptoData();
}

async function fetchCurrentWeather(lat, lon) {
  try {
    const response = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial`);
    if (!response.ok) throw new Error('Failed to fetch weather');
    return await response.json();
  } catch (error) {
    console.error('Weather fetch error:', error);
    showError('Failed to load weather data');
    return null;
  }
}

async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial`);
    if (!response.ok) throw new Error('Failed to fetch forecast');
    return await response.json();
  } catch (error) {
    console.error('Forecast fetch error:', error);
    showError('Failed to load forecast data');
    return null;
  }
}

async function updateWeather() {
  showLoading();
  const { lat, lon } = cityCoordinates[settings.weatherCity];
  const weatherData = await fetchCurrentWeather(lat, lon);
  if (weatherData) {
    document.getElementById('weather-city').textContent = weatherData.name;
    document.getElementById('weather-temp').textContent = `${Math.round(weatherData.main.temp)}°F`;
    document.getElementById('weather-desc').textContent = weatherData.weather[0].description;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
  }

  const forecastData = await fetchForecast(lat, lon);
  if (forecastData) {
    const dailyForecasts = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) dailyForecasts[date] = [];
      dailyForecasts[date].push(item);
    });
    const dates = Object.keys(dailyForecasts).slice(0, 3);
    const forecastHTML = dates.map(date => {
      const dayData = dailyForecasts[date];
      const noon = new Date(date).setHours(12, 0, 0, 0);
      const closest = dayData.reduce((prev, curr) => {
        return Math.abs(prev.dt * 1000 - noon) < Math.abs(curr.dt * 1000 - noon) ? prev : curr;
      });
      return `
        <div class="forecast-item">
          <p>${date}</p>
          <img src="http://openweathermap.org/img/wn/${closest.weather[0].icon}.png">
          <p>${Math.round(closest.main.temp)}°F</p>
        </div>
      `;
    }).join('');
    document.getElementById('forecast').innerHTML = forecastHTML;
  }
  hideLoading();
}

function updateTime() {
  const timeZone = document.getElementById('time-zone').value;
  const options = {
    timeZone: timeZone === 'local' ? undefined : timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  document.getElementById('time').textContent = new Intl.DateTimeFormat([], options).format(new Date());
}

function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem('settings'));
  if (savedSettings) settings = { ...settings, ...savedSettings };
  document.getElementById('crypto-list').value = settings.cryptoList.join(',');
  document.getElementById('unsplash-theme').value = settings.unsplashTheme;
  document.getElementById('update-interval').value = settings.updateInterval;
  document.getElementById('weather-city').value = settings.weatherCity;
  document.getElementById('sound-effects').checked = settings.soundEffects;
}

function saveSettings() {
  settings.cryptoList = document.getElementById('crypto-list').value.split(',').map(s => s.trim());
  settings.unsplashTheme = document.getElementById('unsplash-theme').value;
  settings.updateInterval = parseInt(document.getElementById('update-interval').value);
  settings.weatherCity = document.getElementById('weather-city').value;
  settings.soundEffects = document.getElementById('sound-effects').checked;
  localStorage.setItem('settings', JSON.stringify(settings));
  updateCryptoDropdown();
  setUpdateInterval();
  setBackground();
  updateCryptoData();
  updateWeather();
  toggleSettings();
}

function setAlert() {
  const coinId = document.getElementById('crypto-select').value;
  const alertPrice = parseFloat(document.getElementById('alert-price').value);
  if (!isNaN(alertPrice)) {
    alerts[coinId] = alertPrice;
    localStorage.setItem('alerts', JSON.stringify(alerts));
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    if (settings.soundEffects) sounds.click.play();
  }
}

let updateIntervalId;
function setUpdateInterval() {
  if (updateIntervalId) clearInterval(updateIntervalId);
  updateIntervalId = setInterval(() => {
    setBackground();
    updateCryptoData();
    updateWeather();
  }, settings.updateInterval * 60 * 1000);
}

function loadTheme() {
  const isDark = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark', isDark);
  document.getElementById('dark-theme').checked = isDark;
}

function showLoading() {
  document.querySelector('.loading-overlay').style.display = 'flex';
}

function hideLoading() {
  document.querySelector('.loading-overlay').style.display = 'none';
}

function showError(message) {
  document.getElementById('error-message').textContent = message;
  document.querySelector('.error-overlay').style.display = 'flex';
}