import { twemojiUpdate } from '/scripts/functions.js';

const result = document.getElementById('result');

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

const finalAlerts = [];

async function getData(position) {
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=8cb466c81e01454d8044dd368b240a6a&include=alerts&units=I`);
    const fullData = await response.json();
    const data = fullData.data[0];

    let uvIndex = data.uv;
    if (uvIndex > 0 && uvIndex < 3) uvIndex = `${uvIndex} (<span style="color: #83c88b">Low</span>)`;
    if (uvIndex >= 3 && uvIndex < 6) uvIndex = `${uvIndex} (<span style="color: #fedc00">Moderate</span>)`;
    if (uvIndex >= 6 && uvIndex < 8) uvIndex = `${uvIndex} (<span style="color: #f89c1b">High</span>)`;
    if (uvIndex >= 8 && uvIndex < 11) uvIndex = `${uvIndex} (<span style="color: #ee1d23">Very High</span>)`;
    if (uvIndex >= 11) uvIndex = `${uvIndex} (<span style="color: #d83484">Extreme</span>)`;

    let airQuality = data.aqi;
    if (airQuality >= 0 && airQuality < 51) airQuality = `${airQuality} (<span style="color: #a6ce39">Good</span>)`;
    if (airQuality >= 51 && airQuality < 101) airQuality = `${airQuality} (<span style="color: #fff201">Moderate</span>)`;
    if (airQuality >= 101 && airQuality < 151) airQuality = `${airQuality} (<span style="color: #f6901e">Unhealthy for Sensitive Groups</span>)`;
    if (airQuality >= 151 && airQuality < 201) airQuality = `${airQuality} (<span style="color: #ed1d24">Unhealthy</span>)`;
    if (airQuality >= 201 && airQuality < 301) airQuality = `${airQuality} (<span style="color: #a2064a">Very Unhealthy</span>)`;
    if (airQuality >= 301) airQuality = `${airQuality} (<span style="color: #891a1c">Hazardous</span>)`;

    let alerts = fullData.alerts;
    if (alerts.length === 0) alerts = 'None';
    else {
        const newAlerts = [];
        for (let i = 0; i < alerts.length; i++) {
            if (!/has been replaced/g.test(alerts[i].title) && Math.floor(new Date(alerts[i].ends_local).getTime() / 1000) >= Math.floor(new Date().getTime() / 1000)) {
                newAlerts.push(alerts[i]);
            }
        }
        for (let i = 0; i < newAlerts.length; i++) {
            finalAlerts.push(
                `${newAlerts[i].title}\n\n${newAlerts[i].description
                    .replace(/\n/g, ' ')
                    .replace(/^\* (.*?)\.{3}/g, '– $1:\n ')
                    .replace(/ \* (.*?)\.{3}/g, '\n\n– $1:\n ')}\n\n– AFFECTED REGIONS:\n ${newAlerts[i].regions}`
            );
        }
        const abbrAlerts = [];
        for (let i = 0; i < newAlerts.length; i++) {
            abbrAlerts.push(`<span style="text-decoration: underline dotted; cursor: pointer" onclick="showWeatherAlert(${i})">${newAlerts[i].title.replace(/ issued.*/g, '')} (${newAlerts[i].severity})</span>`); // prettier-ignore
        }
        alerts = abbrAlerts.join(', ');
    }

    const output = [
        `Information from ${data.city_name}, ${data.state_code} (${data.country_code}) – Latitude: ${data.lat}, Longitude: ${data.lon} – Station ID: ${data.station}`, //
        `Updated on ${moment.unix(data.ts).local('').format('LLLL')}<br />`,
        `Active Alerts: ${alerts}`,
        `<textarea style="width: 40rem; max-width: 80%; margin-bottom: 25px; display: none" id="alert-display" readonly></textarea>`,
        `Sunrise: ${moment.utc(data.sunrise, 'HH:mm').local().format('hh:mm A')}`,
        `Sunset: ${moment.utc(data.sunset, 'HH:mm').local().format('hh:mm A')}`,
        `Weather: ${data.weather.description} <img height="25" width="25" style="transform: translateY(6px)" src="https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png" alt="${data.weather.description}">`,
        `Precipitation: ${data.precip} inches/hour`,
        `Snowfall: ${data.snow} inches/hour`,
        `Cloud Cover: ${data.clouds}%`,
        `Wind: ${data.wind_spd} miles/hour (${data.wind_cdir_full})`,
        `Temperature: ${data.temp}°F (Feels like ${data.app_temp}°F)`,
        `Relative Humidity: ${data.rh}%`,
        `Dew Point: ${data.dewpt}°F`,
        `Visibility: ${data.vis} miles`,
        `Pressure: ${data.pres} millibars`,
        `UV Index: ${uvIndex}`,
        `Air Quality: ${airQuality}`,
        `Moon Phase: <span id="moon-phase">Loading...</span>`,
    ];

    result.innerHTML = output.join('<br />');

    twemojiUpdate();

    const lunarResponse = await fetch(`https://www.icalendar37.net/lunar/api/?lang=en&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}&size=20&lightColor=rgb(255%2C255%2C210)&shadeColor=black&texturize=false&LDZ=${new Date(new Date().getFullYear(), new Date().getMonth(), 1) / 1000}`);
    const lunarData = await lunarResponse.json();

    const day = new Date().getDate();
    let phaseName = lunarData.phase[day].phaseName;
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

function showWeatherAlert(alert) {
    const alertDisplay = document.getElementById('alert-display');
    if (alertDisplay.value !== finalAlerts[alert] || alertDisplay.style.display !== 'unset') {
        alertDisplay.style.display = 'unset';
        alertDisplay.value = finalAlerts[alert];
    } else alertDisplay.style.display = 'none';
}
