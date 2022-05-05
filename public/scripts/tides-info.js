let result = document.getElementById('result');

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getData, function (error) {
            if (error.code === error.PERMISSION_DENIED) {
                result.innerHTML = '<span class="error">Permission to fetch location data denied! Allow this then reload.</span>';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                result.innerHTML = '<span class="error">Location information is unavailable. Try again later.</span>';
            } else if (error.code === error.TIMEOUT) {
                result.innerHTML = '<span class="error">The request to get your location timed out. Try again later.</span>';
            } else {
                result.innerHTML = '<span class="error">Unable to fetch location data!</span>';
            }
        });
    } else {
        result.innerHTML = '<span class="error">Geolocation is not supported by this browser.</span>';
    }
}

getLocation();

function getData(position) {
    fetch(`https://tides.p.rapidapi.com/tides?longitude=${position.coords.longitude}&latitude=${position.coords.latitude}&interval=60&duration=10080`, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'tides.p.rapidapi.com',
            'x-rapidapi-key': 'cad0c4a24emshf2d49b2583652a3p143d3bjsn021aa48df62e',
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let latitude = data.origin.latitude;
            let longitude = data.origin.longitude;
            let distance = `${data.origin.distance} ${data.origin.unit}`;
            let updated = moment.unix(data.timestamp).local('').format('LLLL');
            let state = data.heights[0].state.toLowerCase();
            let closest_extreme, next_extreme;
            if (data.extremes[0].timestamp >= Math.floor(new Date().getTime() / 1000)) {
                closest_extreme = `next ${data.extremes[0].state.toLowerCase()} is at ${moment.unix(data.extremes[0].timestamp).local('').format('hh:mm A')}`;
            } else {
                closest_extreme = `most recent ${data.extremes[0].state.toLowerCase()} was at ${moment.unix(data.extremes[0].timestamp).local('').format('hh:mm A')}`;
            }
            if (data.extremes[1].timestamp >= Math.floor(new Date().getTime() / 1000)) {
                next_extreme = `next ${data.extremes[1].state.toLowerCase()} is at ${moment.unix(data.extremes[1].timestamp).local('').format('hh:mm A')}`;
            } else {
                next_extreme = `most recent ${data.extremes[1].state.toLowerCase()} was at ${moment.unix(data.extremes[1].timestamp).local('').format('hh:mm A')}`;
            }
            let next_extremes = `The ${closest_extreme}, and the ${next_extreme}.`;
            let table = [
                `<table class="info-table" style="width: 40%; margin: 0 0 10px 10px">`, //
                `<thead>`,
                `<tr>`,
                `<th style="width: 300px">Time</th>`,
                `<th style="width: 100px">Type</th>`,
                `</tr>`,
                `</thead>`,
                `<tbody>`,
            ];
            for (let i = 0; i < data.extremes.length; i++) {
                table.push(`<tr>`, `<td>${moment.unix(data.extremes[i].timestamp).local('').format('dddd, MMMM Do – h:mm A')}</td>`, `<td>${correctCase(data.extremes[i].state)}</td>`, `</tr>`);
            }
            table.push(`</tbody`, `</table>`);

            let output = [
                `Based on information at latitide ${latitude}, longitude ${longitude}, ${distance} away.`, //
                `Updated on ${updated}.<br />`,
                `The tide is currently ${state}.`,
                `${next_extremes}<br />`,
                `${table.join('')}`,
            ];

            result.innerHTML = output.join('<br />');
        })
        .catch((err) => {});
}

function correctCase(input) {
    return input
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
}
