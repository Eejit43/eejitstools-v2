import { titleCase } from '../../functions.js';

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

/**
 * Fetches tidal information for the specified permission and displays the information
 * @param {GeolocationPosition} position the position to fetch location for
 */
async function getData(position) {
    const response = await fetch(`https://tides.p.rapidapi.com/tides?longitude=${position.coords.longitude}&latitude=${position.coords.latitude}&interval=60&duration=10080`, { method: 'GET', headers: { 'x-rapidapi-host': 'tides.p.rapidapi.com', 'x-rapidapi-key': 'cad0c4a24emshf2d49b2583652a3p143d3bjsn021aa48df62e' } }); // cspell:disable-line
    const data = await response.json();

    const { latitude } = data.origin;
    const { longitude } = data.origin;
    const distance = `${data.origin.distance} ${data.origin.unit}`;
    const updated = `${new Date(data.timestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}, ${new Date(data.timestamp * 1000).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const state = data.heights[0].state.toLowerCase();

    let closestExtreme, nextExtreme;

    if (data.extremes[0].timestamp >= Math.floor(new Date().getTime() / 1000)) closestExtreme = `next ${data.extremes[0].state.toLowerCase()} is at ${new Date(data.extremes[0].timestamp).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;
    else closestExtreme = `most recent ${data.extremes[0].state.toLowerCase()} was at ${new Date(data.extremes[0].timestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;

    if (data.extremes[1].timestamp >= Math.floor(new Date().getTime() / 1000)) nextExtreme = `next ${data.extremes[1].state.toLowerCase()} is at ${new Date(data.extremes[1].timestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;
    else nextExtreme = `most recent ${data.extremes[1].state.toLowerCase()} was at ${new Date(data.extremes[1].timestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;

    const nextExtremes = `The ${closestExtreme}, and the ${nextExtreme}.`;

    const table = [
        '<table class="info-table" style="width: 40%; margin: 0 0 10px 10px">', //
        '<thead>',
        '<tr>',
        '<th style="width: 300px">Time</th>',
        '<th style="width: 100px">Type</th>',
        '</tr>',
        '</thead>',
        '<tbody>'
    ];
    for (let i = 0; i < data.extremes.length; i++) table.push('<tr>', `<td>${new Date(data.extremes[i].timestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}, ${new Date(data.extremes[i].timestamp * 1000).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</td>`, `<td>${titleCase(data.extremes[i].state)}</td>`, '</tr>');
    table.push('</tbody', '</table>');

    const output = [
        `Based on information at latitude ${latitude}, longitude ${longitude}, ${distance} away.`, //
        `Updated at ${updated}.<br />`,
        `The tide is currently ${state}.`,
        `${nextExtremes}<br />`,
        `${table.join('')}`
    ];

    result.innerHTML = output.join('<br />');
}
