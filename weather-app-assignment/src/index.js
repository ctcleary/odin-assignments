import "./styles.css";

// This is a free public API Key, in a production environment this would require back-end work to protect.
const VISUAL_CROSSING_API_KEY = 'PCGWK76LSAU6S5CDBNM5DCV4M';
const VISUAL_CROSSING_BASE_REQ = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';


async function getWeatherData(loc = '', date = null) {
    const locStr = loc || 'manhattan';
    const searchDate = date ? new Date(date + ' 12:00') : new Date();
    const dateStr = `${searchDate.getFullYear()}-${searchDate.getMonth() + 1}-${searchDate.getDate()}`
    
    const errorMessageEl = document.getElementById('fetch-error');
    errorMessageEl.textContent = '';

    try {
        const response = await fetch(`${VISUAL_CROSSING_BASE_REQ}/${locStr}/${dateStr}?key=${VISUAL_CROSSING_API_KEY}`);
        if (!response.ok) {
            throw new Error('Response status :: ', response.status);
        }
        const responseJSON = await response.json();
        
        const addr = responseJSON.resolvedAddress;
        const day = responseJSON.days[0];

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

    } catch (error) {
        console.error('Error fetching data :: ', error.message)
        errorMessageEl.textContent = 'Error fetching data. Please provide valid search criteria.';
    }

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

    tempMax.innerHTML = parseAndRound(data.tempmax) + '&deg; /';
    temp.innerHTML = parseAndRound(data.temp) + '&deg;';
    tempMin.innerHTML = parseAndRound(data.tempmin) + '&deg;';

    const conditions = document.getElementById('conditions');
    const description = document.getElementById('description');
    conditions.textContent = data.conditions;
    description.textContent = data.description;

    const precipitation = document.getElementById('precipitation');
    precipitation.textContent = data.precipprob + '%';
}

const customSearchForm = document.getElementById('custom-search-form');
const locSearchInput = document.getElementById('search-location');

const dateSearchInput = document.getElementById('search-date');

customSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasLoc = true;
    if (!locSearchInput.value || locSearchInput.value === '') {
        console.log('No location entered.');
        hasLoc = false;
    }

    let hasDate = true;
    if (!dateSearchInput.value || dateSearchInput.value === '') {
        console.log('No date entered.');
        hasDate = false;
    }
    
   
    getWeatherData(locSearchInput.value.trim(), dateSearchInput.value);
});