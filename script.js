const dDate = document.getElementById('date');
const address = document.getElementById('add');
const temp = document.getElementById('temp');
const cond = document.getElementById('cond');
const humid = document.getElementById('humid');
const wind = document.getElementById('wind');
const unitBtn = document.getElementById('unit');
const loc = document.getElementById('loc');
const btn = document.getElementById('search');
const sel = document.getElementById('sel');
let isMetric = true;
let currentCelsiusTemp = 0;

const apiKey = '4XKJ3SCD6V4HDSD3F3ZF4EPVH';

function updateUnitText() {
    unitBtn.innerHTML = isMetric ? '&deg;C' : '&deg;F';
}

function updateTemperatureDisplay() {
    if (isMetric) {
        temp.innerHTML = `<p>Temperature: ${currentCelsiusTemp.toFixed(2)} &deg;C</p>`;
    } else {
        const tempFahrenheit = (currentCelsiusTemp * 9 / 5) + 32;
        temp.innerHTML = `<p>Temperature: ${tempFahrenheit.toFixed(2)} &deg;F</p>`;
    }
}

// Function to get the date in the format YYYY-MM-DD
function getFormattedDate(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays); // Add offsetDays (can be negative or positive)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to get weather data based on the selected period
async function getResult() {
    const location = loc.value;
    if (!location) {
        alert("Please enter a location!");
        return;
    }

    let startDate, endDate;

    // Check the user's selection
    const selectedOption = sel.value.toLowerCase();
    if (selectedOption === 'today') {
        startDate = getFormattedDate(0); // Today
        endDate = startDate;
    } else if (selectedOption === 'tomorrow') {
        startDate = getFormattedDate(1); // Tomorrow
        endDate = startDate;
    } else if (selectedOption === 'next10') {
        startDate = getFormattedDate(0); // Today
        endDate = getFormattedDate(10); // 10 days from today
    } else {
        alert("Please select a valid time period!");
        return;
    }

    const units = 'metric'; // Always fetch data in Celsius
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startDate}/${endDate}?unitGroup=${units}&key=${apiKey}&contentType=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        const data = await response.json();
        document.body.className = ''; // Reset background classes

        const condition = data.currentConditions.conditions.toLowerCase();
        if (condition.includes('sunny')) {
            document.body.classList.add('sunny');
        } else if (condition.includes('rain')) {
            document.body.classList.add('rainy');
        } else if (condition.includes('cloud')) {
            document.body.classList.add('cloudy');
        } else if (condition.includes('snow')) {
            document.body.classList.add('snowy');
        }

        // Update other elements in the DOM
        dDate.innerHTML = `<h3>Date: ${startDate}</h3>`;
        address.innerHTML = `<h3>Weather in ${data.resolvedAddress}</h3>`;
        cond.innerHTML = `<p>Condition: ${data.currentConditions.conditions}</p>`;
        humid.innerHTML = `<p>Humidity: ${data.currentConditions.humidity} %</p>`;
        wind.innerHTML = `<p>Wind Speed: ${data.currentConditions.windspeed} ${isMetric ? 'km/h' : 'mph'}</p>`;

        // Store the temperature in Celsius
        currentCelsiusTemp = data.currentConditions.temp;

        // Update the temperature display based on the current unit
        updateTemperatureDisplay();
    } catch (error) {
        console.log(error);
    }
}

// Event listener for the search button
btn.addEventListener('click', getResult);

// Event listener for the unit toggle button
unitBtn.addEventListener('click', () => {
    isMetric = !isMetric; // Toggle between Celsius and Fahrenheit
    updateUnitText(); // Update the button text
    updateTemperatureDisplay(); // Update the temperature display
});