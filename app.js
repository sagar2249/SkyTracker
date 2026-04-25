// ===== CONFIGURATION =====
const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ===== STATE MANAGEMENT =====
let currentLocation = {
    lat: null,
    lon: null,
    city: ''
};

let lastWeatherData = null;
let notificationsEnabled = false;

// ===== WEATHER ICON MAPPING =====
const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkNotificationPermission();
});

function initializeApp() {
    // Try to get user's location automatically on load
    getUserLocation();
}

function setupEventListeners() {
    document.getElementById('locationBtn').addEventListener('click', getUserLocation);
    document.getElementById('searchBtn').addEventListener('click', searchLocation);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchLocation();
    });
}

// ===== GEOLOCATION =====
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLocation.lat = position.coords.latitude;
            currentLocation.lon = position.coords.longitude;
            fetchWeatherData(currentLocation.lat, currentLocation.lon);
        },
        (error) => {
            hideLoading();
            let errorMessage = 'Unable to retrieve your location';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location permission denied. Please enable location access or search for a city manually.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
            }
            
            showError(errorMessage);
        }
    );
}

// ===== SEARCH FUNCTIONALITY =====
async function searchLocation() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        return;
    }

    showLoading();

    try {
        const response = await fetch(
            `${API_BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        currentLocation.lat = data.coord.lat;
        currentLocation.lon = data.coord.lon;
        currentLocation.city = data.name;

        fetchWeatherData(currentLocation.lat, currentLocation.lon);
        searchInput.value = '';
    } catch (error) {
        hideLoading();
        showError('City not found. Please try another search.');
    }
}

// ===== WEATHER DATA FETCHING =====
async function fetchWeatherData(lat, lon) {
    try {
        // Fetch current weather
        const currentWeatherPromise = fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        // Fetch forecast data (5-day forecast with 3-hour intervals)
        const forecastPromise = fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const [currentResponse, forecastResponse] = await Promise.all([
            currentWeatherPromise,
            forecastPromise
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        lastWeatherData = { current: currentData, forecast: forecastData };
        
        displayWeatherData(currentData, forecastData);
        checkForSevereWeather(currentData, forecastData);
        
        hideLoading();
        showMainContent();
    } catch (error) {
        hideLoading();
        showError('Failed to fetch weather data. Please try again.');
        console.error('Weather fetch error:', error);
    }
}

// ===== DISPLAY WEATHER DATA =====
function displayWeatherData(current, forecast) {
    // Update city name and date/time
    document.getElementById('cityName').textContent = current.name + ', ' + current.sys.country;
    document.getElementById('dateTime').textContent = formatDateTime(new Date());

    // Update current weather
    const iconCode = current.weather[0].icon;
    document.getElementById('weatherIconLarge').innerHTML = 
        `<span class="icon-emoji">${weatherIcons[iconCode] || '🌤️'}</span>`;
    document.getElementById('tempValue').textContent = Math.round(current.main.temp);
    document.getElementById('weatherDescription').textContent = current.weather[0].description;

    // Update weather details
    document.getElementById('humidity').textContent = current.main.humidity + '%';
    document.getElementById('windSpeed').textContent = current.wind.speed + ' m/s';
    document.getElementById('precipitation').textContent = 
        (current.rain?.['1h'] || current.snow?.['1h'] || 0) + ' mm';
    document.getElementById('visibility').textContent = (current.visibility / 1000).toFixed(1) + ' km';
    document.getElementById('pressure').textContent = current.main.pressure + ' hPa';
    document.getElementById('feelsLike').textContent = Math.round(current.main.feels_like) + '°C';

    // Update hourly forecast (next 24 hours)
    displayHourlyForecast(forecast.list.slice(0, 8));

    // Update 5-day forecast
    displayDailyForecast(forecast.list);

    // Update last updated time
    document.getElementById('lastUpdated').textContent = formatTime(new Date());
}

function displayHourlyForecast(hourlyData) {
    const container = document.getElementById('hourlyForecast');
    container.innerHTML = '';

    hourlyData.forEach(hour => {
        const time = new Date(hour.dt * 1000);
        const iconCode = hour.weather[0].icon;
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <div class="hourly-time">${formatTime(time)}</div>
            <div class="hourly-icon">${weatherIcons[iconCode] || '🌤️'}</div>
            <div class="hourly-temp">${Math.round(hour.main.temp)}°C</div>
        `;
        
        container.appendChild(hourlyItem);
    });
}

function displayDailyForecast(forecastList) {
    const container = document.getElementById('dailyForecast');
    container.innerHTML = '';

    // Group forecast by day
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                date: date,
                temps: [],
                weather: item.weather[0],
                icon: item.weather[0].icon
            };
        }
        
        dailyData[dateKey].temps.push(item.main.temp);
    });

    // Display up to 5 days
    Object.values(dailyData).slice(0, 5).forEach(day => {
        const maxTemp = Math.round(Math.max(...day.temps));
        const minTemp = Math.round(Math.min(...day.temps));
        
        const dailyItem = document.createElement('div');
        dailyItem.className = 'daily-item';
        dailyItem.innerHTML = `
            <div class="daily-date">${formatDate(day.date)}</div>
            <div class="daily-icon">${weatherIcons[day.icon] || '🌤️'}</div>
            <div class="daily-description">${day.weather.description}</div>
            <div class="daily-temp-range">
                <span class="temp-high">${maxTemp}°</span>
                <span class="temp-low">${minTemp}°</span>
            </div>
        `;
        
        container.appendChild(dailyItem);
    });
}

// ===== SEVERE WEATHER ALERTS =====
function checkForSevereWeather(current, forecast) {
    const alerts = [];
    
    // Check for extreme conditions
    if (current.weather[0].main === 'Thunderstorm') {
        alerts.push({
            title: '⛈️ Thunderstorm Warning',
            description: 'Severe thunderstorm conditions detected in your area. Stay indoors and away from windows.'
        });
    }
    
    if (current.weather[0].main === 'Snow' && current.wind.speed > 10) {
        alerts.push({
            title: '❄️ Blizzard Warning',
            description: 'Heavy snow and high winds detected. Avoid travel if possible.'
        });
    }
    
    // Check for extreme temperatures
    if (current.main.temp > 40) {
        alerts.push({
            title: '🌡️ Extreme Heat Warning',
            description: 'Dangerously high temperatures. Stay hydrated and avoid prolonged sun exposure.'
        });
    }
    
    if (current.main.temp < -10) {
        alerts.push({
            title: '🥶 Extreme Cold Warning',
            description: 'Dangerously low temperatures. Dress warmly and limit time outdoors.'
        });
    }
    
    // Check for heavy rain (potential flash flood)
    const rainAmount = current.rain?.['1h'] || 0;
    if (rainAmount > 10) {
        alerts.push({
            title: '🌊 Flash Flood Warning',
            description: 'Heavy rainfall detected. Avoid low-lying areas and do not drive through flooded roads.'
        });
    }
    
    // Check for high winds
    if (current.wind.speed > 20) {
        alerts.push({
            title: '💨 High Wind Warning',
            description: 'Strong winds detected. Secure loose objects and avoid areas with trees.'
        });
    }
    
    // Check forecast for upcoming severe weather
    forecast.list.slice(0, 8).forEach(item => {
        if (item.weather[0].main === 'Thunderstorm' && !alerts.some(a => a.title.includes('Thunderstorm'))) {
            alerts.push({
                title: '⚠️ Severe Weather Alert',
                description: `Thunderstorms expected at ${formatTime(new Date(item.dt * 1000))}. Plan accordingly.`
            });
        }
    });
    
    // Display alerts and send notifications
    if (alerts.length > 0) {
        showAlert(alerts[0]);
        
        if (notificationsEnabled && Notification.permission === 'granted') {
            sendNotification(alerts[0].title, alerts[0].description);
        }
    }
}

function showAlert(alert) {
    const banner = document.getElementById('alertBanner');
    const title = banner.querySelector('.alert-title');
    const description = banner.querySelector('.alert-description');
    
    title.textContent = alert.title;
    description.textContent = alert.description;
    
    banner.classList.remove('hidden');
}

function closeAlert() {
    document.getElementById('alertBanner').classList.add('hidden');
}

// ===== NOTIFICATIONS =====
function checkNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            // Show modal after 3 seconds if location is obtained
            setTimeout(() => {
                if (currentLocation.lat) {
                    showNotificationModal();
                }
            }, 3000);
        } else if (Notification.permission === 'granted') {
            notificationsEnabled = true;
        }
    }
}

function showNotificationModal() {
    document.getElementById('notificationModal').classList.remove('hidden');
}

function closeNotificationModal() {
    document.getElementById('notificationModal').classList.add('hidden');
}

async function enableNotifications() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            notificationsEnabled = true;
            closeNotificationModal();
            
            sendNotification(
                '✅ Weather Alerts Enabled',
                'You will now receive notifications for severe weather conditions.'
            );
        } else {
            closeNotificationModal();
            showError('Notification permission denied. You can enable it in your browser settings.');
        }
    }
}

function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '⛅',
            badge: '⚠️',
            requireInteraction: true
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
}

// ===== UI STATE MANAGEMENT =====
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

function showMainContent() {
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('loading').classList.add('hidden');
}

function retryFetch() {
    if (currentLocation.lat && currentLocation.lon) {
        fetchWeatherData(currentLocation.lat, currentLocation.lon);
    } else {
        getUserLocation();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDateTime(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(date) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
}

// ===== AUTO-REFRESH =====
// Refresh weather data every 10 minutes
setInterval(() => {
    if (currentLocation.lat && currentLocation.lon) {
        fetchWeatherData(currentLocation.lat, currentLocation.lon);
    }
}, 600000);

// ===== BACKGROUND UPDATES =====
// Check for severe weather every 5 minutes when page is in background
if ('serviceWorker' in navigator) {
    // Service worker would go here for background sync
    // This is a simplified version
    setInterval(() => {
        if (document.hidden && currentLocation.lat && currentLocation.lon) {
            fetch(`${API_BASE_URL}/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    lastWeatherData = { ...lastWeatherData, current: data };
                    checkForSevereWeather(data, lastWeatherData.forecast);
                })
                .catch(error => console.error('Background fetch error:', error));
        }
    }, 300000); // 5 minutes
}
