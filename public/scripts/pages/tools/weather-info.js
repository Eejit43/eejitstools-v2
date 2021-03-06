/* global GeolocationPosition */

const result = document.getElementById('result');

/**
 * Requests the browser's current location and handles any errors
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getData, (error) => {
            if (error.code === error.PERMISSION_DENIED) result.innerHTML = '<span class="error">Permission to fetch location data denied! Allow this then reload.</span>';
            else if (error.code === error.POSITION_UNAVAILABLE) result.innerHTML = '<span class="error">Location information is unavailable. Try again later.</span>';
            else if (error.code === error.TIMEOUT) result.innerHTML = '<span class="error">The request to get your location timed out. Try again later.</span>';
            else result.innerHTML = '<span class="error">Unable to fetch location data!</span>';
        });
    } else result.innerHTML = '<span class="error">Geolocation is not supported by this browser.</span>';
}

getLocation();

const uvIndexes = {
    0: { color: '#83c88b', text: 'Low' },
    1: { color: '#fedc00', text: 'Moderate' },
    2: { color: '#f89c1b', text: 'High' },
    3: { color: '#ee1d23', text: 'Very High' },
    4: { color: '#d83484', text: 'Extreme' }
};

const airQualities = {
    0: { color: '#a6ce39', text: 'Good' },
    1: { color: '#fff201', text: 'Moderate' },
    2: { color: '#f6901e', text: 'Unhealthy for Sensitive Groups' },
    3: { color: '#ed1d24', text: 'Unhealthy' },
    4: { color: '#a2064a', text: 'Very Unhealthy' },
    5: { color: '#891a1c', text: 'Hazardous' }
};

/**
 * Fetches weather information for the specified permission and displays the information
 * @param {GeolocationPosition} position the position to fetch location for
 */
async function getData(position) {
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=8cb466c81e01454d8044dd368b240a6a&include=alerts&units=I`);
    const fullData = await response.json();
    const data = fullData.data[0];

    let uvIndexDescription;

    const uvIndex = data.uv;
    if (uvIndex > 0 && uvIndex < 3) uvIndexDescription = uvIndexes[0];
    else if (uvIndex >= 3 && uvIndex < 6) uvIndexDescription = uvIndexes[1];
    else if (uvIndex >= 6 && uvIndex < 8) uvIndexDescription = uvIndexes[2];
    else if (uvIndex >= 8 && uvIndex < 11) uvIndexDescription = uvIndexes[3];
    else if (uvIndex >= 11) uvIndexDescription = uvIndexes[4];

    let airQualityDescription;

    const airQuality = data.aqi;
    if (airQuality >= 0 && airQuality < 51) airQualityDescription = airQualities[0];
    else if (airQuality >= 51 && airQuality < 101) airQualityDescription = airQualities[1];
    else if (airQuality >= 101 && airQuality < 151) airQualityDescription = airQualities[2];
    else if (airQuality >= 151 && airQuality < 201) airQualityDescription = airQualities[3];
    else if (airQuality >= 201 && airQuality < 301) airQualityDescription = airQualities[4];
    else if (airQuality >= 301) airQualityDescription = airQualities[5];

    result.innerHTML = [
        `Information from ${data.city_name}, ${data.state_code} (${data.country_code}) ??? Latitude: ${data.lat}, Longitude: ${data.lon} ??? Station ID: ${data.station}`, //
        `Updated at ${new Date(data.ts * 1000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}, ${new Date(data.ts * 1000).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}<br />`,
        'Active Alerts: <span id="alerts"></span>',
        '<textarea style="width: 40rem; max-width: 80%; margin-bottom: 25px; display: none" id="alert-display" readonly></textarea>',
        `Sunrise: ${new Date(`${data.sunrise} ${new Date().toLocaleDateString()} UTC`).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`,
        `Sunset: ${new Date(`${data.sunset} ${new Date().toLocaleDateString()} UTC`).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`,
        `Weather: ${data.weather.description} <img height="25" width="25" style="transform: translateY(6px)" src="https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png" alt="${data.weather.description}">`,
        `Precipitation: ${data.precip} inches/hour`,
        `Snowfall: ${data.snow} inches/hour`,
        `Cloud Cover: ${data.clouds}%`,
        `Wind: ${data.wind_spd} miles/hour (${data.wind_cdir_full})`,
        `Temperature: ${data.temp}??F (Feels like ${data.app_temp}??F)`,
        `Relative Humidity: ${data.rh}%`,
        `Dew Point: ${data.dewpt}??F`,
        `Visibility: ${data.vis} miles`,
        `Pressure: ${data.pres} millibars`,
        `UV Index: ${uvIndex}${uvIndexDescription ? ` (<span style="color: ${uvIndexDescription.color}">${uvIndexDescription.text}</span>)` : ''}`,
        `Air Quality: ${airQuality}${airQualityDescription ? ` (<span style="color: ${airQualityDescription.color}">${airQualityDescription.text}</span>)` : ''}`,
        'Moon Phase: <span id="moon-phase">Loading...</span>'
    ].join('<br />');

    const { alerts } = fullData;

    const newAlerts = [];
    for (const alert of alerts) {
        if (!/has been replaced/g.test(alert.title) && Math.floor(new Date(alert.ends_local).getTime() / 1000) >= Math.floor(new Date().getTime() / 1000)) newAlerts.push(alert);
    }

    const alertsList = document.getElementById('alerts');

    if (newAlerts.length > 0) {
        newAlerts.forEach((alert) => {
            const alertElement = document.createElement('span');
            alertElement.classList.add('alert');
            alertElement.textContent = `${alert.title.replace(/ issued.*/g, '')} (${alert.severity})`;

            const appendedElement = alertsList.appendChild(alertElement);

            appendedElement.addEventListener('click', () => showWeatherAlert(alert));
        });
    } else alertsList.textContent = 'None';

    const lunarResponse = await fetch(`https://www.icalendar37.net/lunar/api/?lang=en&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}&size=20&lightColor=rgb(255%2C255%2C210)&shadeColor=black&texturize=false&LDZ=${new Date(new Date().getFullYear(), new Date().getMonth(), 1) / 1000}`);
    const lunarData = await lunarResponse.json();

    const day = new Date().getDate();
    let { phaseName } = lunarData.phase[day];
    const lighting = Math.round(lunarData.phase[day].lighting);
    if (phaseName === 'Waxing' && lighting < 50) phaseName = 'Waxing crescent';
    else if (phaseName === 'Waxing' && lighting > 50) phaseName = 'Waxing gibbous';

    if (phaseName === 'Waning' && lighting < 50) phaseName = 'Waning crescent';
    else if (phaseName === 'Waning' && lighting > 50) phaseName = 'Waning gibbous';

    const html = `${phaseName} ${lunarData.phase[day].isPhaseLimit ? '' : `(${lighting}% illuminated)`} ${lunarData.phase[day].svg
        .replace(/<a.*?>(.*?)<\/a>/g, '$1')
        .replace(/style="pointer-events:all;cursor:pointer"/g, '')
        .replace(/<svg(.*?)>/g, `<svg style="transform: translateY(3px)"$1><title>${phaseName} moon</title>`)}`;

    document.getElementById('moon-phase').innerHTML = html;
}

/**
 * Shows the specified weather alert
 * @param {number} alert the alert number
 */
function showWeatherAlert(alert) {
    const alertDisplay = document.getElementById('alert-display');

    const alertText = `${alert.title}\n\n${alert.description.replace(/\n/g, ' ').replace(/^\* (.*?)\.{3}/g, '??? $1:\n ').replace(/ \* (.*?)\.{3}/g, '\n\n??? $1:\n ')}\n\n??? AFFECTED REGIONS:\n ${alert.regions}`; // prettier-ignore

    if (alertDisplay.value !== alertText || alertDisplay.style.display !== 'unset') {
        alertDisplay.style.display = 'unset';
        alertDisplay.value = alertText;
    } else alertDisplay.style.display = 'none';
}
