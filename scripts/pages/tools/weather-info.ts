const result = document.querySelector('#result') as HTMLDivElement;

/**
 * Requests the browser's current location and handles any errors.
 */
function getLocation() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(getData, (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED: {
                    result.innerHTML = '<span class="error">Permission to fetch location data denied! Allow this then reload.</span>';
                    break;
                }
                case error.POSITION_UNAVAILABLE: {
                    result.innerHTML = '<span class="error">Location information is unavailable. Try again later.</span>';
                    break;
                }
                case error.TIMEOUT: {
                    result.innerHTML = '<span class="error">The request to get your location timed out. Try again later.</span>';
                    break;
                }
                default: {
                    result.innerHTML = '<span class="error">Unable to fetch location data!</span>';
                }
            }
        });
    else result.innerHTML = '<span class="error">Geolocation is not supported by this browser.</span>';
}

getLocation();

const uvIndexes = {
    0: { color: '#83c88b', text: 'Low' },
    1: { color: '#fedc00', text: 'Moderate' },
    2: { color: '#f89c1b', text: 'High' },
    3: { color: '#ee1d23', text: 'Very High' },
    4: { color: '#d83484', text: 'Extreme' },
};

const airQualities = {
    0: { color: '#a6ce39', text: 'Good' },
    1: { color: '#fff201', text: 'Moderate' },
    2: { color: '#f6901e', text: 'Unhealthy for Sensitive Groups' },
    3: { color: '#ed1d24', text: 'Unhealthy' },
    4: { color: '#a2064a', text: 'Very Unhealthy' },
    5: { color: '#891a1c', text: 'Hazardous' },
};

/* eslint-disable @typescript-eslint/naming-convention */
interface Alert {
    description: string;
    title: string;
    ends_local: string;
    regions: string[];
    severity: string;
}

interface WeatherInformation {
    alerts: Alert[];
    data: [
        {
            app_temp: number;
            aqi: number;
            city_name: string;
            clouds: number;
            country_code: string;
            dewpt: number;
            lat: number;
            lon: number;
            precip: number;
            pres: number;
            rh: number;
            snow: number;
            state_code: string;
            station: string;
            sunrise: string;
            sunset: string;
            temp: number;
            ts: number;
            uv: number;
            vis: number;
            weather: { description: string; icon: string };
            wind_cdir_full: string;
            wind_spd: number;
        },
    ];
}
/* eslint-enable @typescript-eslint/naming-convention */

interface LunarData {
    phase: Record<
        string,
        {
            phaseName: string;
            lighting: number;
            isPhaseLimit: boolean | number;
            svg: string;
        }
    >;
}

/**
 * Fetches weather information for the specified permission and displays the information.
 * @param position The position to fetch location for.
 */
async function getData(position: GeolocationPosition) {
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=8cb466c81e01454d8044dd368b240a6a&include=alerts&units=I`);
    const fullData = (await response.json()) as WeatherInformation;
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
        `Information from ${data.city_name}, ${data.state_code} (${data.country_code}) – Latitude: ${data.lat}, Longitude: ${data.lon} – Station ID: ${data.station}`, //
        `Updated at ${new Date(data.ts * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}, ${new Date(data.ts * 1000).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}<br />`,
        'Active Alerts: <span id="alerts"></span>',
        '<textarea style="width: 40rem; max-width: 80%; margin-bottom: 25px; display: none" id="alert-display" readonly></textarea>',
        `Sunrise: ${new Date(`${data.sunrise} ${new Date().toLocaleDateString()} UTC`).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`,
        `Sunset: ${new Date(`${data.sunset} ${new Date().toLocaleDateString()} UTC`).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`,
        `Weather: ${data.weather.description} <img height="25" width="25" style="transform: translateY(6px)" src="https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png" alt="${data.weather.description}">`,
        `Precipitation: ${data.precip} inches/hour`,
        `Snowfall: ${data.snow} inches/hour`,
        `Cloud Cover: ${data.clouds}%`,
        `Wind: ${data.wind_spd} miles/hour (${data.wind_cdir_full})`,
        `Temperature: ${data.temp}°F${data.app_temp === data.temp ? '' : ` (Feels like ${data.app_temp}°F)`}`,
        `Relative Humidity: ${data.rh}%`,
        `Dew Point: ${data.dewpt}°F`,
        `Visibility: ${data.vis} miles`,
        `Pressure: ${data.pres} millibars`,
        `UV Index: ${uvIndex}${uvIndexDescription ? ` (<span style="color: ${uvIndexDescription.color}">${uvIndexDescription.text}</span>)` : ''}`,
        `Air Quality: ${airQuality}${airQualityDescription ? ` (<span style="color: ${airQualityDescription.color}">${airQualityDescription.text}</span>)` : ''}`,
        'Moon Phase: <span id="moon-phase">Loading...</span>',
    ].join('<br />');

    const { alerts } = fullData;

    const newAlerts = [];
    for (const alert of alerts) if (!/has been replaced/.test(alert.title) && Math.floor(new Date(alert.ends_local).getTime() / 1000) >= Math.floor(Date.now() / 1000)) newAlerts.push(alert);

    const alertsList = document.querySelector('#alerts') as HTMLSpanElement;

    if (newAlerts.length > 0)
        for (const [index, alert] of newAlerts.entries()) {
            const alertElement = document.createElement('span');
            alertElement.classList.add('alert');
            alertElement.textContent = `${alert.title.replaceAll(/ issued.*/g, '')} (${alert.severity})`;
            alertElement.addEventListener('click', () => showWeatherAlert(alert));

            alertsList.append(alertElement);

            if (index !== newAlerts.length - 1) alertsList.append(document.createTextNode(', '));
        }
    else alertsList.textContent = 'None';

    const lunarResponse = await fetch(
        `https://www.icalendar37.net/lunar/api/?lang=en&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}&size=20&lightColor=%23ffffd2&shadeColor=%2314191f&texturize=false&LDZ=${
            new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000
        }`,
    );
    const lunarData = (await lunarResponse.json()) as LunarData;

    const day = new Date().getDate();
    let { phaseName } = lunarData.phase[day];
    const lighting = Math.round(lunarData.phase[day].lighting);
    if (phaseName === 'Waxing' && lighting < 50) phaseName = 'Waxing crescent';
    else if (phaseName === 'Waxing' && lighting > 50) phaseName = 'Waxing gibbous';

    if (phaseName === 'Waning' && lighting < 50) phaseName = 'Waning crescent';
    else if (phaseName === 'Waning' && lighting > 50) phaseName = 'Waning gibbous';

    const html = `${phaseName} ${lunarData.phase[day].isPhaseLimit ? '' : `(${lighting}% illuminated)`} ${lunarData.phase[day].svg
        .replaceAll(/<a.*?>(.*?)<\/a>/g, '$1')
        .replaceAll('style="pointer-events:all;cursor:pointer"', '')
        .replaceAll(/<svg(.*?)>/g, `<svg style="transform: translateY(3px)"$1><title>${phaseName} moon</title>`)}`;

    (document.querySelector('#moon-phase') as HTMLSpanElement).innerHTML = html;
}

/**
 * Shows the specified weather alert.
 * @param alert The alert.
 */
function showWeatherAlert(alert: Alert) {
    const alertDisplay = document.querySelector('#alert-display') as HTMLTextAreaElement;

    const alertText = `${alert.title}\n\n${alert.description
        .replaceAll('\n', ' ')
        .replaceAll(/^\* (.*?)\.{3}/g, '– $1:\n ')
        .replaceAll(/ \* (.*?)\.{3}/g, '\n\n– $1:\n ')}\n\n– AFFECTED REGIONS:\n ${alert.regions.join(', ')}`;

    if (alertDisplay.value !== alertText || alertDisplay.style.display !== 'unset') {
        alertDisplay.style.display = 'unset';
        alertDisplay.value = alertText;
    } else alertDisplay.style.display = 'none';
}
