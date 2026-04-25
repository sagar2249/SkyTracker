# SkyTrack - Advanced Weather Forecasting Application

A modern, feature-rich weather application that provides real-time weather data, forecasts, and severe weather alerts using the OpenWeatherMap API.

![Weather App](https://img.shields.io/badge/Weather-App-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Latest-orange)
![CSS3](https://img.shields.io/badge/CSS3-Latest-blue)

## 🌟 Features

### Core Functionality
- **Real-Time Weather Data**: Displays current temperature, humidity, precipitation, wind speed, visibility, pressure, and "feels like" temperature
- **Location Services**: Automatic geolocation detection to show weather for user's current location
- **City Search**: Search functionality to view weather for any city worldwide
- **Hourly Forecast**: 24-hour forecast with 3-hour intervals
- **5-Day Forecast**: Extended forecast showing daily high/low temperatures and conditions

### Advanced Features
- **Severe Weather Alerts**: Real-time detection and notifications for:
  - Thunderstorms and lightning
  - Flash floods (heavy rainfall detection)
  - Tornado warnings (simulated based on extreme wind conditions)
  - Extreme temperatures (heat and cold warnings)
  - High wind alerts
  - Blizzard conditions
  
- **Push Notifications**: Browser notifications for severe weather events when user grants permission
- **Auto-Refresh**: Weather data automatically updates every 10 minutes
- **Background Monitoring**: Continues monitoring weather even when browser tab is inactive
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices
- **Visual Weather Icons**: Emoji-based weather icons that change based on conditions and time of day

### UI/UX Features
- **Modern Design**: Glassmorphism effects with atmospheric gradient backgrounds
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Loading States**: Clear loading indicators and error handling
- **Alert Banner**: Prominent display of severe weather warnings

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone or download the project files**
   - `index.html`
   - `styles.css`
   - `app.js`

2. **Get an API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key (free tier includes 60 calls/minute, 1,000,000 calls/month)

3. **Configure the API Key**
   - Open `app.js` in your code editor
   - Replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

4. **Run the Application**
   - Open `index.html` in your web browser
   - Allow location access when prompted (or search for a city manually)
   - Enable notifications when prompted to receive severe weather alerts

### Project Structure
```
weather-app/
│
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── app.js             # JavaScript functionality
└── README.md          # Documentation
```

## 🛠️ Technical Implementation

### APIs Used
- **OpenWeatherMap Current Weather API**: Fetches real-time weather data
- **OpenWeatherMap 5-Day Forecast API**: Provides hourly and daily forecasts
- **Geolocation API**: Detects user's current location
- **Notification API**: Sends browser push notifications

### Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Custom properties, gradients, animations, glassmorphism effects
- **Vanilla JavaScript (ES6+)**: Async/await, fetch API, DOM manipulation
- **Google Fonts**: Outfit (display) and JetBrains Mono (monospace)

### Key Features Implementation

**Severe Weather Detection Algorithm**:
```javascript
- Thunderstorm detection (weather condition)
- Flash flood warning (rainfall > 10mm/hour)
- Extreme heat/cold (temp > 40°C or < -10°C)
- High wind alert (wind speed > 20 m/s)
- Blizzard conditions (snow + high winds)
```

**Data Update Schedule**:
- Main refresh: Every 10 minutes
- Background check: Every 5 minutes (when tab inactive)
- Real-time alerts: Immediate on data fetch

## 📱 Usage Guide

### First Time Setup
1. Open the application
2. Click "Use My Location" or search for a city
3. Click "Enable Alerts" when prompted for severe weather notifications

### Search for a City
1. Type city name in the search bar (e.g., "New York", "London", "Tokyo")
2. Press Enter or click Search button
3. Weather data will update automatically

### Understanding the Interface
- **Main Display**: Current temperature and conditions
- **Detail Cards**: Humidity, wind, precipitation, visibility, pressure, feels-like temp
- **Hourly Forecast**: Scrollable 24-hour forecast
- **Daily Forecast**: 5-day outlook with high/low temperatures
- **Alert Banner**: Appears at top when severe weather is detected

## 🎯 Resume Description

**How to describe this project on your resume:**

### Option 1 (Detailed):
```
Weather Forecasting Application
• Developed a full-stack weather application using HTML5, CSS3, and JavaScript that 
  integrates with OpenWeatherMap API to provide real-time weather data and forecasts
• Implemented geolocation services to automatically detect user location and severe 
  weather alert system that monitors for flash floods, tornadoes, extreme temperatures, 
  and other hazardous conditions
• Designed responsive UI with glassmorphism effects and smooth animations that works 
  seamlessly across desktop and mobile devices
• Integrated browser notification API to alert users of severe weather changes even 
  when the application is running in the background
• Utilized asynchronous JavaScript (async/await) for efficient API calls and data 
  processing, with automatic data refresh every 10 minutes
```

### Option 2 (Concise):
```
Real-Time Weather Application with Severe Weather Alerts
• Built responsive weather app using JavaScript, HTML5, CSS3 with OpenWeatherMap API 
  integration
• Implemented geolocation tracking, browser notifications, and severe weather alert 
  system for flash floods, tornadoes, and extreme conditions
• Features include hourly/5-day forecasts, auto-refresh, and modern glassmorphism UI
```

### Option 3 (Technical Focus):
```
Weather Monitoring & Alert System
• Designed and implemented weather tracking application with RESTful API integration 
  (OpenWeatherMap)
• Developed severe weather detection algorithm that monitors real-time data for 
  dangerous conditions (precipitation >10mm/hr for flash floods, wind speed >20m/s, 
  temperature extremes)
• Utilized browser APIs: Geolocation for location tracking, Notification for push 
  alerts, Fetch for async data retrieval
• Implemented automatic background monitoring with 5-minute update intervals and 
  notification system for weather changes
```

## 🔧 Customization

### Changing Temperature Units
To switch from Celsius to Fahrenheit, modify the API calls in `app.js`:
```javascript
// Change units=metric to units=imperial
`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
```

### Adjusting Alert Thresholds
Modify the thresholds in the `checkForSevereWeather()` function:
```javascript
if (rainAmount > 10) { ... }  // Change 10 to your preferred threshold
if (current.main.temp > 40) { ... }  // Adjust temperature thresholds
```

### Styling Customization
All colors are defined as CSS variables in `:root` selector in `styles.css`:
```css
:root {
    --sky-dawn: #4A5FCC;
    --accent-warm: #FF6B6B;
    /* Modify these values to change the color scheme */
}
```

## 📊 Performance Optimization

- Efficient API usage with data caching
- Minimal DOM manipulation with batch updates
- CSS animations over JavaScript animations
- Lazy loading for forecast data
- Debounced search input

## 🔐 Privacy & Security

- No personal data stored or transmitted except location coordinates
- API key should be kept secure (don't commit to public repositories)
- Location data only used for weather queries
- No third-party tracking or analytics

## 🐛 Troubleshooting

**Weather data not loading:**
- Verify your API key is correct
- Check browser console for error messages
- Ensure you have internet connection
- Verify API quota hasn't been exceeded

**Location not working:**
- Grant location permission in browser settings
- Try searching for a city manually
- Check if browser supports Geolocation API

**Notifications not appearing:**
- Grant notification permission in browser settings
- Ensure browser supports Notification API
- Check if "Do Not Disturb" mode is enabled

## 📈 Future Enhancements

- Weather map visualization with radar overlay
- Historical weather data and trends
- Multiple location tracking
- Weather comparison between cities
- UV index and air quality data
- Sunrise/sunset times with visualization
- Moon phase tracking
- Weather-based recommendations (clothing, activities)
- Social sharing features
- PWA (Progressive Web App) capabilities
- Dark/light mode toggle

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons: Unicode emoji characters
- Fonts: Google Fonts (Outfit, JetBrains Mono)

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review OpenWeatherMap API documentation
3. Verify all files are present and API key is configured

---

**Built with ❤️ using Vanilla JavaScript**
