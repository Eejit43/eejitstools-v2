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

let finalAlerts = [];

function getData(position) {
    fetch(`https://api.weatherbit.io/v2.0/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=8cb466c81e01454d8044dd368b240a6a&include=alerts&units=I`)
        .then((response) => {
            return response.json();
        })
        .then((pre_data) => {
            let data = pre_data.data[0];

            let uv_index = data.uv;
            if (uv_index > 0 && uv_index < 3) uv_index = `${uv_index} (<span style="color: #83c88b">Low</span>)`;
            if (uv_index >= 3 && uv_index < 6) uv_index = `${uv_index} (<span style="color: #fedc00">Moderate</span>)`;
            if (uv_index >= 6 && uv_index < 8) uv_index = `${uv_index} (<span style="color: #f89c1b">High</span>)`;
            if (uv_index >= 8 && uv_index < 11) uv_index = `${uv_index} (<span style="color: #ee1d23">Very High</span>)`;
            if (uv_index >= 11) uv_index = `${uv_index} (<span style="color: #d83484">Extreme</span>)`;

            let air_quality = data.aqi;
            if (air_quality >= 0 && air_quality < 51) air_quality = `${air_quality} (<span style="color: #a6ce39">Good</span>)`;
            if (air_quality >= 51 && air_quality < 101) air_quality = `${air_quality} (<span style="color: #fff201">Moderate</span>)`;
            if (air_quality >= 101 && air_quality < 151) air_quality = `${air_quality} (<span style="color: #f6901e">Unhealthy for Sensitive Groups</span>)`;
            if (air_quality >= 151 && air_quality < 201) air_quality = `${air_quality} (<span style="color: #ed1d24">Unhealthy</span>)`;
            if (air_quality >= 201 && air_quality < 301) air_quality = `${air_quality} (<span style="color: #a2064a">Very Unhealthy</span>)`;
            if (air_quality >= 301) air_quality = `${air_quality} (<span style="color: #891a1c">Hazardous</span>)`;

            let alerts = pre_data.alerts;
            if (alerts.length === 0) {
                alerts = 'None';
            } else {
                let newAlerts = [];
                for (let i = 0; i < alerts.length; i++) {
                    if (!/has been replaced/g.test(alerts[i].title) && !Math.floor(new Date(alerts[i].ends_local).getTime() / 1000) < Math.floor(new Date().getTime() / 1000)) {
                        newAlerts.push(alerts[i]);
                    }
                }
                let abbrAlerts = [];
                for (let i = 0; i < newAlerts.length; i++) {
                    finalAlerts.push(
                        `${newAlerts[i].title}\n\n${newAlerts[i].description
                            .replace(/\n/g, ' ')
                            .replace(/^\* (.*?)\.{3}/g, '– $1:\n ')
                            .replace(/ \* (.*?)\.{3}/g, '\n\n– $1:\n ')}\n\n– AFFECTED REGIONS:\n ${newAlerts[i].regions}`
                    );
                }
                for (let i = 0; i < newAlerts.length; i++) {
                    abbrAlerts.push(`<span style="text-decoration: underline dotted; cursor: pointer" onclick="showWeatherAlert(${i})">${newAlerts[i].title.replace(/ issued.*/g, '')} (${newAlerts[i].severity})</span>`); // prettier-ignore
                }
                alerts = abbrAlerts.join(', ');
            }

            let output = [
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
                `UV Index: ${uv_index}`,
                `Air Quality: ${air_quality}`,
                `Moon Phase: <span id="moon-phase">Loading...</span>`,
            ];

            result.innerHTML = output.join('<br />');

            twemojiUpdate();

            fetch(`https://www.icalendar37.net/lunar/api/?lang=en&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}&size=20&lightColor=rgb(255%2C255%2C210)&shadeColor=black&texturize=false&LDZ=${new Date(new Date().getFullYear(), new Date().getMonth(), 1) / 1000}`) // prettier-ignore
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let day = new Date().getDate();
                    let phaseName = data.phase[day].phaseName;
                    let lighting = Math.round(data.phase[day].lighting);
                    if (phaseName === 'Waxing' && lighting < 50) {
                        phaseName = 'Waxing crescent';
                    } else if (phaseName === 'Waxing' && lighting > 50) {
                        phaseName = 'Waxing gibbous';
                    }
                    if (phaseName === 'Waning' && lighting < 50) {
                        phaseName = 'Waning crescent';
                    } else if (phaseName === 'Waning' && lighting > 50) {
                        phaseName = 'Waning gibbous';
                    }
                    let html = `${phaseName} ${data.phase[day].isPhaseLimit ? '' : `(${lighting}% illuminated)`} ${data.phase[day].svg
                        .replace(/<a.*?>(.*?)<\/a>/g, '$1')
                        .replace(/style="pointer-events:all;cursor:pointer"/g, '')
                        .replace(/<svg(.*?)>/g, `<svg style="transform: translateY(3px)"$1><title>${phaseName} moon</title>`)}`;
                    document.getElementById('moon-phase').innerHTML = html;
                })
                .catch((err) => {});
        })
        .catch((err) => {});
}

function showWeatherAlert(alert) {
    let alert_display = document.getElementById('alert-display');
    if (alert_display.value !== finalAlerts[alert] || alert_display.style.display !== 'unset') {
        alert_display.style.display = 'unset';
        alert_display.value = finalAlerts[alert];
    } else {
        alert_display.style.display = 'none';
    }
}
