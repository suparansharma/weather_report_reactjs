import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import LineChart from './components/LineChart';

function App() {
  const [cityName, setCityName] = useState('');

  const [weatherData, setWeatherData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [error, setError] = useState(null);
  // Assuming you have a state variable for averageTempMaxArray
  const [averageTempMaxArray, setAverageTempMaxArray] = useState([]);
  const [averageTempMinArray, setAverageTempMinArray] = useState([]);
  const [dateArray, setDateArray] = useState([]);

  const apiKey = '805af68c71f238865fc5e9b2614a0e87'; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
  console.log("currentWeather", currentWeather);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(apiUrl);

      // Set the current weather data to the state
      await setCurrentWeather(response.data);

      // Create a map to store temp_max values for each unique date
      const tempMaxMap = new Map();
      const tempMinMap = new Map();



      currentWeather.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];

        // Check if the date is already in the map
        if (tempMaxMap.has(date)) {
          // If yes, add the temp_max value to the existing array
          tempMaxMap.get(date).push(item.main.temp_max);
        } else {
          // If no, create a new array with the temp_max value
          tempMaxMap.set(date, [item.main.temp_max]);
        }


        // Handling temp_min
        if (tempMinMap.has(date)) {
          tempMinMap.get(date).push(item.main.temp_min);
        } else {
          tempMinMap.set(date, [item.main.temp_min]);
        }


      });





      // Calculate the average temp_max for each date
      const averageTempMaxArray = Array.from(tempMaxMap.entries()).map(([date, tempMaxValues]) => ({
        date,
        average_temp_max: tempMaxValues.reduce((sum, value) => sum + value, 0) / tempMaxValues.length
      }));


      const averageTempMinArray = Array.from(tempMinMap.entries()).map(([date, tempMinValues]) => ({
        date,
        average_temp_min: tempMinValues.reduce((sum, value) => sum + value, 0) / tempMinValues.length
      }));



      // Extract dates, average_temp_max, and average_temp_min arrays
      const datesArray = averageTempMaxArray.map(entry => entry.date);
      const tempMaxArray = averageTempMaxArray.map(entry => entry.average_temp_max);
      const tempMinArray = averageTempMinArray.map(entry => entry.average_temp_min);

      // Now you have separate arrays for dates, average_temp_max, and average_temp_min
      console.log("Dates Array:", datesArray);
      console.log("Temp Max Array:", tempMaxArray);
      console.log("Temp Min Array:", tempMinArray);

      // console.log("Average Temp Max Array:", averageTempMaxArray);
      // console.log("Average Temp Min Array:", averageTempMinArray);


      // If you want to use the array outside the function, you can set it to a state variable
      setDateArray(datesArray)
      setAverageTempMaxArray(tempMaxArray);
      setAverageTempMinArray(tempMaxArray);
    } catch (error) {
      // Handle errors by updating the error state
      setError('Error fetching weather data. Please try again.');
      console.error('Error fetching weather data:', error);
    }
  };



  // ...

  useEffect(() => {
    if (cityName === '') {
      setCurrentWeather(null);
    } else {
      fetchWeatherData();
    }
  }, [cityName]);

  // Now you can access averageTempMaxArray and averageTempMinArray in your component
  console.log("Outside fetchWeatherData - Temp Max:", averageTempMaxArray);
  console.log("Outside fetchWeatherData - Temp Min:", averageTempMinArray);




  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get(apiUrl);
  //     setWeatherData(response.data);
  //     const uniqueDates = [...new Set(weatherData.list.map(item => item.dt_txt.split(' ')[0]))];
  //     console.log("uniqueDates", uniqueDates);
  //   } catch (error) {
  //     console.error('Error fetching weather data:', error);
  //   }
  // };


  const handleSearch = () => {
    // Check if the city name is empty
    if (cityName === '') {
      setError('Please enter a valid city name.');
      setCurrentWeather(null)
      return;
    }

    // Clear any previous errors
    setError(null);

    // Make the API request
    fetchWeatherData();
  };

  //  useEffect(() => {
  //    // Call the fetchWeatherData function when the component mounts and whenever cityName changes
  //    if (cityName === '') {
  //      setCurrentWeather(null)
  //    } else {
  //      fetchWeatherData();
  //    }
  //  }, [cityName]);




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
          <h2>Weather Information</h2>
          <p>Country: {currentWeather.city.country}</p>
          <p>Population: {currentWeather.city.population}</p>
          <p>Sunrise: {dayjs.unix(currentWeather.city.sunrise).format('HH:mm:ss')}</p>
          <p>Sunset: {dayjs.unix(currentWeather.city.sunset).format('HH:mm:ss')}</p>
          <p>Timezone: {currentWeather.city.timezone}</p>
          {/* Add more weather information as needed */}

          {/* <h2>Temperature Chart</h2> */}
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
};

export default App;

