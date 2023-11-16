// import logo from './logo.svg';
// import './App.css';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [cityName, setCityName] = useState('');
//   const [currentWeather, setCurrentWeather] = useState(null);
//   const [error, setError] = useState(null);
//   console.log("cityName", cityName);
//   console.log("currentWeather", currentWeather);
//   console.log("error", error);

//   const handleSearch = () => {
//     // Check if the city name is empty
//     if (cityName.trim() === '') {
//       setError('Please enter a valid city name.');
//       return;
//     }

//     // Clear any previous errors
//     setError(null);

//     // Make the API request
//     fetchWeatherData();
//   };

//   const fetchWeatherData = async () => {
//     try {
//       const response = await axios.get(
//         // `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=805af68c71f238865fc5e9b2614a0e87`
//         `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=805af68c71f238865fc5e9b2614a0e87`
//       );

//       // Set the current weather data to the state
//       setCurrentWeather(response.data);
//     } catch (error) {
//       // Handle errors by updating the error state
//       setError('Error fetching weather data. Please try again.');
//       console.error('Error fetching weather data:', error);
//     }
//   };

//   useEffect(() => {
//     // Call the fetchWeatherData function when the component mounts and whenever cityName changes
//     if (cityName === '') {
//       setCurrentWeather(null)
//     } else {
//       fetchWeatherData();
//     }
//   }, [cityName]);

//   return (
//     <>
//       <div className="container">
//         <form className="col-12 m-auto py-5">
//           <div className="input-group mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Enter a location for Weather ..."
//               value={cityName}
//               onChange={(e) => setCityName(e.target.value)}
//             />
//             <div className="input-group-append">
//               <button type="button" className="btn btn-danger" onClick={handleSearch}>
//                 Search
//               </button>
//             </div>
//           </div>
//         </form>

//         {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

//         {currentWeather !== null ? (
//           <div>
//             <p>Temperature: {currentWeather.main.temp} K</p>
//             <p>Humidity: {currentWeather.main.humidity}%</p>
//             <p>Wind Speed: {currentWeather.wind.speed} m/s</p>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </>
//   );
// }

// export default App;







import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherApp = () => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = '805af68c71f238865fc5e9b2614a0e87'; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
console.log(weatherData);
  const handleSearch = async () => {
    try {
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div  className="container">
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

      {weatherData ? (
        <div>
          <h2>Weather Information</h2>
          <p>Country: {weatherData.city.country}</p>
          {/* Add more weather information as needed */}
        </div>
      ) : (
        <p>Enter a location and click "Search" to get weather information.</p>
      )}
    </div>
  );
};

export default WeatherApp;

