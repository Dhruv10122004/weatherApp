const unitBtn = document.getElementById('unit');
const loc = document.getElementById('loc');
const btn = document.getElementById('search');
const forecastContainer = document.getElementById('forecast'); 
let isMetric = true;

const apiKey = '4XKJ3SCD6V4HDSD3F3ZF4EPVH';

function updateUnitText() {
    unitBtn.innerHTML = isMetric ? '&deg;C' : '&deg;F';
}

function updateTemperatureDisplay() {
    const tempElements = document.querySelectorAll('.temperature');
    tempElements.forEach((tempElement) => {
        const celsiusTemp = parseFloat(tempElement.dataset.celsiusTemp);
        if (isMetric) {
            tempElement.innerHTML = `Temperature: ${celsiusTemp.toFixed(2)} &deg;C`;
        } else {
            const tempFahrenheit = (celsiusTemp * 9 / 5) + 32;
            tempElement.innerHTML = `Temperature: ${tempFahrenheit.toFixed(2)} &deg;F`;
        }
    });
}

function getFormattedDate(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function getResult() {
    const location = loc.value;
    if (!location) {
        alert("Please enter a location!");
        return;
    }

    forecastContainer.innerHTML = ''; 
    const startDate = getFormattedDate(0);
    const endDate = getFormattedDate(7); 

    await fetchAPI(location, startDate, endDate);
}

async function fetchAPI(location, startDate, endDate) {
    const units = 'metric';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startDate}/${endDate}?unitGroup=${units}&key=${apiKey}&contentType=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        const data = await response.json();

        console.log(data);

        const resolvedAddress = data.resolvedAddress; 
        data.days.forEach((dayData) => {
            updateDOMWithForecast(dayData, resolvedAddress);
        });

    } catch (error) {
        console.log(error);
    }
}

function updateDOMWithForecast(dayData, resolvedAddress) {
    const dayForecast = document.createElement('div');
    dayForecast.className = 'day-forecast';

    const tempCelsius = dayData.temp; 
    dayForecast.innerHTML = `
        <h3>Date: ${dayData.datetime}</h3>
        <h4>Weather in ${resolvedAddress}</h4>
        <p>Condition: ${dayData.conditions}</p>
        <p class="temperature" data-celsius-temp="${tempCelsius}">
            Temperature: ${tempCelsius.toFixed(2)} &deg;C
        </p>
        <p>Humidity: ${dayData.humidity} %</p>
        <p>Wind Speed: ${dayData.windspeed} ${isMetric ? 'km/h' : 'mph'}</p>
    `;

    forecastContainer.appendChild(dayForecast);

    const condition = dayData.conditions.toLowerCase(); 
    if (condition.includes('sunny')) {
        dayForecast.classList.add('sunny');
    } else if (condition.includes('rain')) {
        dayForecast.classList.add('rainy');
    } else if (condition.includes('cloud')) {
        dayForecast.classList.add('cloudy');
    } else if (condition.includes('snow')) {
        dayForecast.classList.add('snowy');
    }
}

btn.addEventListener('click', getResult);
unitBtn.addEventListener('click', () => {
    isMetric = !isMetric; 
    updateUnitText(); 
    updateTemperatureDisplay(); 
});
