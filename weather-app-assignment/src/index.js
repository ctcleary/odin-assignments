import "./styles.css";

const VISUAL_CROSSING_API_KEY = 'PCGWK76LSAU6S5CDBNM5DCV4M';
const VISUAL_CROSSING_BASE_REQ = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';


async function getWeatherData(loc) {
    const locStr = loc || 'manhattan';
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    console.log(todayStr);
    const response = await fetch(`${VISUAL_CROSSING_BASE_REQ}/${locStr}/${todayStr}?key=${VISUAL_CROSSING_API_KEY}`)
    const responseJSON = await response.json();

    const addr = responseJSON.resolvedAddress;
    const day = responseJSON.days[0];
    console.log(
        day.tempmax,
        day.temp,
        day.tempmin
    )
    const dataPackage = {
        addr: addr,
        date: day.datetime,
        temp: day.temp,
        tempmax: day.tempmax,
        tempmin: day.tempmin,
        conditions: day.conditions,
        description: day.description,
        precipprob : day.precipprob,
    }
    renderWeatherData(dataPackage);
}

getWeatherData();

function parseAndRound(numStr) {    
    return Math.round(parseInt(numStr, 10));
}

function renderWeatherData(data) {
    const location = document.getElementById('location');
    location.textContent = data.addr;

    const date = document.getElementById('date');
    date.textContent = new Date(data.date + ' 12:00').toDateString();

    const tempMax = document.getElementById('temp-max');
    const temp = document.getElementById('temp');
    const tempMin = document.getElementById('temp-min');

    tempMax.innerHTML = parseAndRound(data.tempmax) + '&deg;';
    temp.innerHTML = parseAndRound(data.temp) + '&deg;';
    tempMin.innerHTML = parseAndRound(data.tempmin) + '&deg;';

    const conditions = document.getElementById('conditions');
    const description = document.getElementById('description');
    conditions.textContent = data.conditions;
    description.textContent = data.description;

    const precipitation = document.getElementById('precipitation');
    precipitation.textContent = data.precipprob + '%';
}

const locSearchForm = document.getElementById('location-search-form');
const locSearchInput = document.getElementById('search-location')

locSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!locSearchInput.value || locSearchInput.value === '') {
        console.log('No search input, exiting.');
        return;
    }
    

    getWeatherData(locSearchInput.value);
    locSearchInput.value = '';
});
