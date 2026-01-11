import { requestGeolocation, titleCase } from '@scripts/functions.js';

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

const message = document.querySelector<HTMLDivElement>('#message')!;
const result = document.querySelector<HTMLDivElement>('#result')!;

const latitudeDisplay = document.querySelector<HTMLSpanElement>('#latitude')!;
const longitudeDisplay = document.querySelector<HTMLSpanElement>('#longitude')!;
const distanceDisplay = document.querySelector<HTMLSpanElement>('#distance')!;
const updatedDisplay = document.querySelector<HTMLSpanElement>('#updated')!;
const tideStateDisplay = document.querySelector<HTMLSpanElement>('#tide-state')!;
const closestExtremeTypeDisplay = document.querySelector<HTMLSpanElement>('#closest-extreme-type')!;
const closestExtremeDisplay = document.querySelector<HTMLSpanElement>('#closest-extreme')!;
const closestExtremeTimeDisplay = document.querySelector<HTMLSpanElement>('#closest-extreme-time')!;
const nextClosestExtremeTypeDisplay = document.querySelector<HTMLSpanElement>('#next-closest-extreme-type')!;
const nextClosestExtremeDisplay = document.querySelector<HTMLSpanElement>('#next-closest-extreme')!;
const nextClosestExtremeTimeDisplay = document.querySelector<HTMLSpanElement>('#next-closest-extreme-time')!;

const upcomingExtremesTableBody = document.querySelector<HTMLTableSectionElement>('#upcoming-extremes tbody')!;

requestGeolocation(getData, message);

/**
 * Fetches tidal information for the specified permission and displays the information.
 * @param position The position to fetch location for.
 */
async function getData(position: GeolocationPosition) {
    const data = (await (
        await fetch(`/tides-info?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)
    ).json()) as TideData;

    const { distance: originDistance, latitude, longitude, unit } = data.origin;

    latitudeDisplay.textContent = latitude.toString();

    longitudeDisplay.textContent = longitude.toString();

    distanceDisplay.textContent = `${originDistance} ${unit}`;

    updatedDisplay.textContent = `${new Date(data.timestamp * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}, ${new Date(
        data.timestamp * 1000,
    ).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })}`;

    const state = data.heights[0].state.toLowerCase();
    tideStateDisplay.textContent = state;
    tideStateDisplay.dataset.iconAfter = state === 'rising' ? '\uF775' : '\uF774';

    closestExtremeTypeDisplay.textContent = data.extremes[0].timestamp > Math.floor(Date.now() / 1000) ? 'next' : 'most recent';
    closestExtremeDisplay.textContent = data.extremes[0].state.toLowerCase();
    closestExtremeTimeDisplay.textContent = new Date(data.extremes[0].timestamp * 1000).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
    });

    nextClosestExtremeTypeDisplay.textContent = data.extremes[1].timestamp > Math.floor(Date.now() / 1000) ? 'next' : 'most recent';
    nextClosestExtremeDisplay.textContent = data.extremes[1].state.toLowerCase();
    nextClosestExtremeTimeDisplay.textContent = new Date(data.extremes[1].timestamp * 1000).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
    });

    for (const extreme of data.extremes) {
        const rowElement = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.textContent = `${new Date(extreme.timestamp * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}, ${new Date(
            extreme.timestamp * 1000,
        ).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}`;

        const stateCell = document.createElement('td');
        stateCell.textContent = titleCase(extreme.state);

        rowElement.append(timeCell, stateCell);

        upcomingExtremesTableBody.append(rowElement);
    }

    message.innerHTML = '';

    result.classList.add('has-data');
}
