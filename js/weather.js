const API_KEY = "0b2c4bafac50aa0e8715062acb786c5f";

function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log("당신의 위치는 ", lat, lon);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weather = document.querySelector(
        "#weather-section span:first-child"
      );
      const city = document.querySelector("#weather-section span:last-child");
      const weatherSection = document.getElementById("weather-section");
      city.innerText = data.name;

      const weatherImage = document.createElement("img");
      switch (data.weather[0].main) {
        case "Clouds":
          weatherImage.src = "./img/cloudy_image.png";
          break;
        case "Rain":
          weatherImage.src = "./img/rainy_image.png";
          break;
        case "Snow":
          weatherImage.src = "./img/snow_image.png";
          break;
        case "Wind":
          weatherImage.src = "./img/wind_image.png";
          break;
        default:
          weatherImage.src = "default_image.png";
          break;
      }
      weatherSection.appendChild(weatherImage);

      weather.innerText = `날씨 : ${data.weather[0].main}
    
     기온 : ${data.main.temp}°C 

     현 위치 : `;
    });
}

function onGeoError() {
  alert("위치를 찾을 수 없습니다. 날씨 파악이 불가능해요");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
