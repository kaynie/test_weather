// api key
const api = 'dde9edf8852a9ec0ea65604438e34bd4';

// weather and location
const iconImg = document.getElementById('weather-icon');
const loc = document.getElementById('location');
const temperature = document.querySelector('.temp');
const desc = document.querySelector('.desc');
const dayWeekMonth = document.querySelector('.day-week-month');
const timeNow = document.querySelector('.time-now');
const status = document.querySelector('.loading-status');

// date time area
// looking for a cleaner method for this, locale date string does not take periods and ordering
// also need ordinal for date according to design
// moments.js usually takes care of this stuff 
let today = new Date(Date.now());
let dateDay = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(today);
let dateMonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(today);
let dateSelf= new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today);
let timeSelf= new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(today).toLowerCase();

const ordinal = (number) => {
  const ordinalRules = new Intl.PluralRules("en", {
    type: "ordinal"
  });
  const suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th"
  };
  const suffix = suffixes[ordinalRules.select(number)];
  return (number + suffix);
}

//
// this can be shown on load immediately w/o geolocation
// date formatted according to design w/ period after shortened month and ordinal after date
//
dayWeekMonth.textContent = `${dateDay}, ${dateMonth}. ` + ordinal(`${dateSelf}`);
timeNow.textContent = `${timeSelf}`;

let options = {
  enableHighAccuracy: false
};

function success(position) {
  let long = position.coords.longitude;
  let lat = position.coords.latitude;

  const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${api}`;

  console.log(base);

  fetch(base)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { temp, feels_like } = data.main;
      const place = data.name;
      //use ID instead of icon image ID for icon library classes
      const { description, id } = data.weather[0];
      const iconClass = `wi-owm-${id}`;

      //
      // show data
      //

      //add icon class to icon font library for correct svg font icon
      iconImg.classList.add(iconClass);
      //show place
      loc.textContent = `${place}`;
      //description of weather
      desc.textContent = `Feels like ${feels_like.toFixed(0)}˚, ${description}.`;
      //show temp in F (AI file had no other descriptors)
      temperature.textContent = `${temp.toFixed(0)}`;

      //undo opacity if it all works
      document.querySelector('.loading').setAttribute('style', 'display: none');
      document.querySelector('.container').setAttribute('style', 'opacity: 100%');
    });
}

function error(err) {
  document.querySelector('.loading').setAttribute('style', 'display: none');
  document.querySelector('.container').setAttribute('style', 'display: none');
  document.querySelector('.container-error').setAttribute('style', 'opacity: 100%; display: block');
}

if(!navigator.geolocation) {
  document.querySelector('.container').setAttribute('style', 'display: none');
  document.querySelector('.container-error').setAttribute('style', 'opacity: 100%; display: block');
} else {
  navigator.geolocation.getCurrentPosition(success, error, options);
}