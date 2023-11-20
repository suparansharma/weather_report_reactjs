import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import LineChart from './components/LineChart';

function App() {
  const [cityName, setCityName] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);

  const [averageTempMaxArray, setAverageTempMaxArray] = useState([]);
  const [averageTempMinArray, setAverageTempMinArray] = useState([]);
  const [dateArray, setDateArray] = useState([]);

  const apiKey = '805af68c71f238865fc5e9b2614a0e87';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(apiUrl);

      await setCurrentWeather(response.data);

      const tempMaxMap = new Map();
      const tempMinMap = new Map();

      currentWeather.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];

        if (tempMaxMap.has(date)) {
          tempMaxMap.get(date).push(item.main.temp_max);
        } else {
          tempMaxMap.set(date, [item.main.temp_max]);
        }

        if (tempMinMap.has(date)) {
          tempMinMap.get(date).push(item.main.temp_min);
        } else {
          tempMinMap.set(date, [item.main.temp_min]);
        }
      });

      const averageTempMaxArray = Array.from(tempMaxMap.entries()).map(([date, tempMaxValues]) => ({
        date,
        average_temp_max: tempMaxValues.reduce((sum, value) => sum + value, 0) / tempMaxValues.length
      }));

      const averageTempMinArray = Array.from(tempMinMap.entries()).map(([date, tempMinValues]) => ({
        date,
        average_temp_min: tempMinValues.reduce((sum, value) => sum + value, 0) / tempMinValues.length
      }));

      const datesArray = averageTempMaxArray.map(entry => entry.date);
      const tempMaxArray = averageTempMaxArray.map(entry => entry.average_temp_max);
      const tempMinArray = averageTempMinArray.map(entry => entry.average_temp_min);

      setDateArray(datesArray);
      setAverageTempMaxArray(tempMaxArray);
      setAverageTempMinArray(tempMinArray);
    } catch (error) {
      console.log('Error fetching weather data. Please try again.');
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    if (cityName === '') {
      setCurrentWeather(null);
    } else {
      fetchWeatherData();
    }
  }, [cityName]);

  const handleSearch = () => {
    if (cityName === '') {
      console.log('Please enter a valid city name.');
      setCurrentWeather(null);
      return;
    }

    console.log('Please enter a valid city name.');
    fetchWeatherData();
  };

  return (
    <div className="container">
      <form className="col-12 m-auto py-5">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter a location for Weather ..."
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
          <div className="input-group-append">
            <button type="button" className="btn btn-danger" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </form>

      {currentWeather !== null ? (
        <div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="weather-status p-4">
                <h2>Weather Information</h2>
                <p>Country: {currentWeather.city.country}</p>
                <p>Population: {currentWeather.city.population}</p>
                <p>Sunrise: {dayjs.unix(currentWeather.city.sunrise).format('HH:mm:ss')}</p>
                <p>Sunset: {dayjs.unix(currentWeather.city.sunset).format('HH:mm:ss')}</p>
                <p>Timezone: {currentWeather.city.timezone}</p>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="weather-status p-4">
                <h3>Current Weather Conditions</h3>
                <p>Temperature: {currentWeather.list[0].main.temp} &#8451;</p>
                <p>Humidity: {currentWeather.list[0].main.humidity}%</p>
                <p>Wind Speed: {currentWeather.list[0].wind.speed} m/s</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Temperature Chart</h2>
              <LineChart
                labels={dateArray}
                tempMaxArray={averageTempMaxArray}
                tempMinArray={averageTempMinArray}
              />
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
