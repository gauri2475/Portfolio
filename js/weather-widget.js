/* ==========================================================================
   Weather App Widget (Live Demo Component)
   ========================================================================== */

class WeatherWidget {
  constructor() {
    this.unit = 'C'; // 'C' or 'F'
    this.weatherData = {
      "Delhi": { tempC: 31, condition: "Sunny / Clear", humidity: 62, wind: 14, icon: "fa-sun" },
      "New York": { tempC: 22, condition: "Partly Cloudy", humidity: 55, wind: 18, icon: "fa-cloud-sun" },
      "London": { tempC: 18, condition: "Light Rain", humidity: 82, wind: 22, icon: "fa-cloud-rain" },
      "Tokyo": { tempC: 27, condition: "Clear", humidity: 60, wind: 10, icon: "fa-sun" },
      "Sydney": { tempC: 20, condition: "Breezy", humidity: 70, wind: 25, icon: "fa-wind" }
    };
    this.currentCity = "Delhi";
    this.initElements();
  }

  initElements() {
    this.cityInput = document.getElementById('weather-city-input');
    this.searchBtn = document.getElementById('weather-search-btn');
    this.cityNameEl = document.getElementById('weather-city-name');
    this.tempEl = document.getElementById('weather-temp-val');
    this.condEl = document.getElementById('weather-cond-text');
    this.humidityEl = document.getElementById('weather-humidity');
    this.windEl = document.getElementById('weather-wind');
    this.unitToggleBtn = document.getElementById('weather-unit-toggle');
    this.iconEl = document.getElementById('weather-icon');

    if (!this.searchBtn) return;

    this.searchBtn.addEventListener('click', () => this.handleSearch());
    this.cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });
    this.unitToggleBtn.addEventListener('click', () => this.toggleUnit());

    this.render();
  }

  handleSearch() {
    const inputCity = this.cityInput.value.trim();
    if (!inputCity) return;

    // Check if city exists in demo set, or create dynamic realistic weather
    const foundCity = Object.keys(this.weatherData).find(
      c => c.toLowerCase() === inputCity.toLowerCase()
    );

    if (foundCity) {
      this.currentCity = foundCity;
    } else {
      // Dynamic fallback for custom city search
      const tempC = Math.floor(Math.random() * 15) + 18;
      const conditions = ["Clear Sky", "Scattered Clouds", "Mild Breeze", "Passing Showers"];
      const randCond = conditions[Math.floor(Math.random() * conditions.length)];
      this.weatherData[inputCity] = {
        tempC: tempC,
        condition: randCond,
        humidity: Math.floor(Math.random() * 40) + 45,
        wind: Math.floor(Math.random() * 15) + 8,
        icon: randCond.includes("Rain") ? "fa-cloud-rain" : "fa-sun"
      };
      this.currentCity = inputCity;
    }

    this.render();
  }

  toggleUnit() {
    this.unit = this.unit === 'C' ? 'F' : 'C';
    this.unitToggleBtn.innerText = `°${this.unit === 'C' ? 'F' : 'C'}`;
    this.render();
  }

  render() {
    const data = this.weatherData[this.currentCity] || this.weatherData["Delhi"];
    let temp = data.tempC;
    if (this.unit === 'F') {
      temp = Math.round((data.tempC * 9/5) + 32);
    }

    this.cityNameEl.innerText = this.currentCity;
    this.tempEl.innerText = `${temp}°${this.unit}`;
    this.condEl.innerText = data.condition;
    this.humidityEl.innerText = `${data.humidity}%`;
    this.windEl.innerText = `${data.wind} km/h`;
    
    if (this.iconEl) {
      this.iconEl.className = `fas ${data.icon} weather-main-icon`;
    }
  }
}

window.WeatherWidget = WeatherWidget;
