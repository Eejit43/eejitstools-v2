import { requestGeolocation, titleCase, twemojiUpdate } from '../../functions.js';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SunCalc: {
            getMoonIllumination: (date: Date) => { fraction: number; phase: { name: string; emoji: string } };
        };
    }
}

const uvIndexes: Record<number, { color: string; text: string }> = {
    0: { color: '#83c88b', text: 'Low' },
    1: { color: '#fedc00', text: 'Moderate' },
    2: { color: '#f89c1b', text: 'High' },
    3: { color: '#ee1d23', text: 'Very high' },
    4: { color: '#d83484', text: 'Extreme' },
};

const airQualities: Record<number, { color: string; text: string }> = {
    0: { color: '#a6ce39', text: 'Good' },
    1: { color: '#fff201', text: 'Moderate' },
    2: { color: '#f6901e', text: 'Unhealthy for sensitive groups' },
    3: { color: '#ed1d24', text: 'Unhealthy' },
    4: { color: '#a2064a', text: 'Very unhealthy' },
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

const message = document.querySelector('#message') as HTMLDivElement;
const result = document.querySelector('#result') as HTMLDivElement;

const locationDisplay = document.querySelector('#location') as HTMLSpanElement;
const latitudeDisplay = document.querySelector('#latitude') as HTMLSpanElement;
const longitudeDisplay = document.querySelector('#longitude') as HTMLSpanElement;
const stationDisplay = document.querySelector('#station') as HTMLSpanElement;
const updatedDisplay = document.querySelector('#updated') as HTMLSpanElement;

requestGeolocation(getData, message);

/**
 * Fetches weather information for the specified permission and displays the information.
 * @param position The position to fetch location for.
 */
async function getData(position: GeolocationPosition) {
    const fullData = (await (await fetch(`/weather-info?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)).json()) as WeatherInformation;
    const data = fullData.data[0];

    let uvIndexDescription: { color: string; text: string } | undefined;

    const uvIndex = data.uv;
    if (uvIndex > 0 && uvIndex < 3) uvIndexDescription = uvIndexes[0];
    else if (uvIndex >= 3 && uvIndex < 6) uvIndexDescription = uvIndexes[1];
    else if (uvIndex >= 6 && uvIndex < 8) uvIndexDescription = uvIndexes[2];
    else if (uvIndex >= 8 && uvIndex < 11) uvIndexDescription = uvIndexes[3];
    else if (uvIndex >= 11) uvIndexDescription = uvIndexes[4];

    let airQualityDescription: { color: string; text: string } | undefined;

    const airQuality = data.aqi;
    if (airQuality >= 0 && airQuality < 51) airQualityDescription = airQualities[0];
    else if (airQuality >= 51 && airQuality < 101) airQualityDescription = airQualities[1];
    else if (airQuality >= 101 && airQuality < 151) airQualityDescription = airQualities[2];
    else if (airQuality >= 151 && airQuality < 201) airQualityDescription = airQualities[3];
    else if (airQuality >= 201 && airQuality < 301) airQualityDescription = airQualities[4];
    else if (airQuality >= 301) airQualityDescription = airQualities[5];

    locationDisplay.textContent = `${data.city_name}, ${data.state_code} (${data.country_code})`;
    latitudeDisplay.textContent = data.lat.toString();
    longitudeDisplay.textContent = data.lon.toString();
    stationDisplay.textContent = data.station;
    updatedDisplay.textContent = `${new Date(data.ts * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}, ${new Date(data.ts * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })}`;

    const output: { icon: string; name: string; value: string | (() => (HTMLElement | string)[]) }[] = [
        { icon: 'sunrise', name: 'Sunrise', value: new Date(`${data.sunrise} ${new Date().toLocaleDateString()} UTC`).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }) },
        { icon: 'sunset', name: 'Sunset', value: new Date(`${data.sunset} ${new Date().toLocaleDateString()} UTC`).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }) },
        {
            icon: 'cloud-sun-rain',
            name: 'Weather',
            value: () => {
                const weatherIcon = document.createElement('img');
                weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`;
                weatherIcon.id = 'weather-icon';

                return [data.weather.description, weatherIcon];
            },
        },
        { icon: 'raindrops', name: 'Precipitation', value: `${data.precip} inches/hour` },
        { icon: 'snowflakes', name: 'Snowfall', value: `${data.snow} inches/hour` },
        { icon: 'clouds', name: 'Cloud Cover', value: `${data.clouds}%` },
        { icon: 'wind', name: 'Wind', value: `${data.wind_spd} miles/hour (${data.wind_cdir_full})` },
        { icon: 'temperature-three-quarters', name: 'Temperature', value: `${data.temp}°F${data.app_temp === data.temp ? '' : ` (Feels like ${data.app_temp}°F)`}` },
        { icon: 'droplet-percent', name: 'Relative Humidity', value: `${data.rh}%` },
        { icon: 'droplet-degree', name: 'Dew Point', value: `${data.dewpt}°F` },
        { icon: 'cloud-fog', name: 'Visibility', value: `${data.vis} miles` },
        { icon: 'gauge-high', name: 'Pressure', value: `${data.pres} millibars` },
        {
            icon: 'sun-cloud',
            name: 'UV Index',
            value: () => {
                const uvIndex = Math.round((data.uv + Number.EPSILON) * 100) / 100;

                let description;
                if (uvIndexDescription) {
                    description = document.createElement('span');
                    description.textContent = uvIndexDescription.text;
                    description.style.color = uvIndexDescription.color;
                }

                return description ? [uvIndex.toString(), ' (', description, ')'] : [uvIndex.toString()];
            },
        },
        {
            icon: 'wind-warning',
            name: 'Air Quality',
            value: () => {
                let description;
                if (airQualityDescription) {
                    description = document.createElement('span');
                    description.textContent = airQualityDescription.text;
                    description.style.color = airQualityDescription.color;
                }

                return description ? [airQuality.toString(), ' (', description, ')'] : [airQuality.toString()];
            },
        },
        {
            icon: 'moon',
            name: 'Moon Phase',
            value: () => {
                const moonInformation = window.SunCalc.getMoonIllumination(new Date());

                return [`${titleCase(moonInformation.phase.name)} (${Math.round(moonInformation.fraction * 100)}% illuminated) ${moonInformation.phase.emoji}`];
            },
        },
    ];

    for (const item of output) {
        const row = document.createElement('div');

        const icon = document.createElement('i');
        icon.className = `fa-regular fa-${item.icon}`;

        row.append(icon, ' ', item.name);

        const value = document.createElement('span');

        if (typeof item.value === 'string') value.textContent = item.value.trim();
        else value.append(...item.value());

        row.append(': ', value);

        result.append(row);
    }

    const { alerts } = fullData;

    const newAlerts = [];
    for (const alert of alerts) if (!/has been replaced/.test(alert.title) && Math.floor(new Date(alert.ends_local).getTime() / 1000) >= Math.floor(Date.now() / 1000)) newAlerts.push(alert);

    const alertsList = document.querySelector('#active-alerts') as HTMLSpanElement;

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

    twemojiUpdate();

    message.innerHTML = '';
    result.classList.add('has-data');
}

/**
 * Shows the specified weather alert.
 * @param alert The alert.
 */
function showWeatherAlert(alert: Alert) {
    const alertDisplay = document.querySelector('#alert-display') as HTMLTextAreaElement;

    const alertText = `${alert.title}\n\n${alert.description
        .replaceAll('\n', ' ')
        .replaceAll(/^\* (.*?)\.{3}/g, '– $1:\n   ')
        .replaceAll(/ \* (.*?)\.{3}/g, '\n\n– $1:\n   ')}`;

    if (alertDisplay.value !== alertText || alertDisplay.style.display !== 'block') {
        alertDisplay.style.display = 'block';
        alertDisplay.value = alertText;
    } else alertDisplay.style.display = 'none';
}
