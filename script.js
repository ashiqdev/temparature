const searchBox = document.getElementById('searchbox');

const searchForm = document.getElementById('form');
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
const cityName = document.getElementById('city');
const temparature = document.getElementById('deg');
const typeOfWeather = document.getElementById('main');
const image = document.getElementById('image');
const sunriseDOM = document.getElementById('sunrise');
const sunsetDOM = document.getElementById('sunset');

function convertTime(unixTime) {
  let dt = new Date(unixTime * 1000);
  let h = dt.getHours();
  let m = '0' + dt.getMinutes();
  let t = h + ':' + m.substr(-2);
  return t;
}

async function getWeatherData(cityName) {
  const appId = '6ed803b2cb93c3b1142f6fd0c3d90df6';

  try {
    const data = await (
      await fetch(` ${baseURL}?q=${cityName}&units=metric&appid=${appId}`)
    ).json();

    console.log({ data });

    if (data.cod === '404') throw new Error(data.message);

    const {
      name,
      sys,
      main: { temp },
      weather,
    } = data;

    console.log({ data });

    const { main, icon } = weather[0];

    const sunrise = convertTime(sys.sunrise);
    const sunset = convertTime(sys.sunset);

    return {
      name,
      temp,
      main,
      icon,
      sunrise,
      sunset,
    };
  } catch (e) {
    return { name: e.message };
  }
}

function updateUI({
  name,
  temp = '',
  main = '',
  icon = '',
  sunrise = '',
  sunset = '',
}) {
  searchBox.value = '';
  cityName.innerText = name;
  temparature.innerText = temp && ` ${temp}°C`;
  typeOfWeather.innerText = main;
  image.src = icon && ` https://openweathermap.org/img/wn/${icon}@2x.png`;
  sunriseDOM.innerText = sunrise && ` Sunrise: ${sunrise}`;
  sunsetDOM.innerText = sunset && ` Sunset: ${sunset}`;
}

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = searchBox.value;
  if (city === '') return;
  const weatherData = await getWeatherData(city);
  updateUI(weatherData);
});
