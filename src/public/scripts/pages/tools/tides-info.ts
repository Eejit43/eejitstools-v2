import { titleCase } from '../../functions.js';

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

interface TideData {
    origin: {
        distance: number;
        unit: string;
        latitude: number;
        longitude: number;
    };
    heights: { state: string }[];
    extremes: { timestamp: number; state: string }[];
    timestamp: number;
}

/**
 * Fetches tidal information for the specified permission and displays the information.
 * @param position The position to fetch location for.
 */
async function getData(position: GeolocationPosition) {
    const response = await fetch(`https://tides.p.rapidapi.com/tides?longitude=${position.coords.longitude}&latitude=${position.coords.latitude}&interval=60&duration=10080`, {
        method: 'GET',
        headers: { 'x-rapidapi-host': 'tides.p.rapidapi.com', 'x-rapidapi-key': 'cad0c4a24emshf2d49b2583652a3p143d3bjsn021aa48df62e' },
    });
    const data = (await response.json()) as TideData;

    const { distance: originDistance, latitude, longitude, unit } = data.origin;
    const distance = `${originDistance} ${unit}`;
    const updated = `${new Date(data.timestamp * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}, ${new Date(data.timestamp * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })}`;
    const state = data.heights[0].state.toLowerCase();

    const closestExtreme =
        data.extremes[0].timestamp >= Math.floor(Date.now() / 1000)
            ? `next ${data.extremes[0].state.toLowerCase()} is at ${new Date(data.extremes[0].timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`
            : `most recent ${data.extremes[0].state.toLowerCase()} was at ${new Date(data.extremes[0].timestamp * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`;

    const nextExtreme =
        data.extremes[1].timestamp >= Math.floor(Date.now() / 1000)
            ? `next ${data.extremes[1].state.toLowerCase()} is at ${new Date(data.extremes[1].timestamp * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`
            : `most recent ${data.extremes[1].state.toLowerCase()} was at ${new Date(data.extremes[1].timestamp * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`;

    const nextExtremes = `The ${closestExtreme}, and the ${nextExtreme}.`;

    const table = ['<table class="info-table">', '<thead>', '<tr>', '<th>Time</th>', '<th>Type</th>', '</tr>', '</thead>', '<tbody>'];
    for (const extreme of data.extremes)
        table.push(
            '<tr>',
            `<td>${new Date(extreme.timestamp * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}, ${new Date(extreme.timestamp * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}</td>`,
            `<td>${titleCase(extreme.state)}</td>`,
            '</tr>',
        );
    table.push('</tbody', '</table>');

    const output = [
        `Based on information at latitude ${latitude}, longitude ${longitude}, ${distance} away.`,
        `Updated at ${updated}.<br />`,
        `The tide is currently ${state}.`,
        `${nextExtremes}<br />`,
        `${table.join('')}`,
    ];

    result.innerHTML = output.join('<br />');
}
