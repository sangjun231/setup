const API_KEY = "0b2c4bafac50aa0e8715062acb786c5f";

const translation_kr = {
  thunderstorm_with_light_rain: "가벼운 비를 동반한 천둥구름",
  thunderstorm_with_rain: "비를 동반한 천둥구름",
  thunderstorm_with_heavy_rain: "폭우를 동반한 천둥구름",
  light_thunderstorm: "약한 천둥구름",
  thunderstorm: "천둥구름",
  heavy_thunderstorm: "강한 천둥구름",
  ragged_thunderstorm: "불규칙적 천둥구름",
  thunderstorm_with_light_drizzle: "약한 연무를 동반한 천둥구름",
  thunderstorm_with_drizzle: "연무를 동반한 천둥구름",
  thunderstorm_with_heavy_drizzle: "강한 안개비를 동반한 천둥구름",
  light_intensity_drizzle: "가벼운 안개비",
  drizzle: "안개비",
  heavy_intensity_drizzle: "강한 안개비",
  light_intensity_drizzle_rain: "가벼운 적은비",
  drizzle_rain: "적은비",
  heavy_intensity_drizzle_rain: "강한 적은비",
  shower_rain_and_drizzle: "소나기와 안개비",
  heavy_shower_rain_and_drizzle: "강한 소나기와 안개비",
  shower_drizzle: "소나기",
  light_rain: "악한 비",
  moderate_rain: "중간 비",
  heavy_intensity_rain: "강한 비",
  very_heavy_rain: "매우 강한 비",
  extreme_rain: "극심한 비",
  freezing_rain: "우박",
  light_intensity_shower_rain: "약한 소나기 비",
  shower_rain: "소나기 비",
  heavy_intensity_shower_rain: "강한 소나기 비",
  ragged_shower_rain: "불규칙적 소나기 비",
  light_snow: "가벼운 눈",
  snow: "눈",
  heavy_snow: "강한 눈",
  sleet: "진눈깨비",
  shower_sleet: "소나기 진눈깨비",
  light_rain_and_snow: "약한 비와 눈",
  rain: "비",
  rain_and_snow: "비와 눈",
  light_shower_snow: "약한 소나기 눈",
  shower_snow: "소나기 눈",
  heavy_shower_snow: "강한 소나기 눈",
  mist: "박무",
  smoke: "연기",
  haze: "연무",
  "sand,_dust_whirls": "모래 먼지",
  fog: "안개",
  sand: "모래",
  dust: "먼지",
  volcanic_ash: "화산재",
  squalls: "돌풍",
  clear: "맑음",
  clear_sky: "구름 한 점 없는 맑은 하늘",
  clouds: "구름",
  few_clouds: "약간의 구름이 낀 하늘",
  scattered_clouds: "드문드문 구름이 낀 하늘",
  broken_clouds: "구름이 거의 없는 하늘",
  overcast_clouds: "구름으로 뒤덮인 흐린 하늘",
  tornado: "토네이도",
  tropical_storm: "태풍",
  cold: "한랭",
  hot: "고온",
  windy: "바람부는",
  hail: "우박",
  calm: "바람이 거의 없는",
  light_breeze: "약한 바람",
  gentle_breeze: "부드러운 바람",
  moderate_breeze: "중간 세기 바람",
  fresh_breeze: "신선한 바람",
  strong_breeze: "센 바람",
  high_win: "돌풍에 가까운 센 바람",
  gale: "돌풍",
  "severe gale": "심각한 돌풍",
  storm: "폭풍",
  violent_storm: "강한 폭풍",
  hurricane: "허리케인",
};

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
