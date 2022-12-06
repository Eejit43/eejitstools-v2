import { twemojiUpdate } from '/scripts/functions.js';

//More info about api data on https://app.abstractapi.com/api/ip-geolocation/documentation

fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=7dcea861f91a44579cea73ad833eff21').then(async (response) => {
    const data = await response.json();

    document.getElementById('ip-address').innerHTML = `${data.ip_address} (${data.security.is_vpn ? 'Is' : 'Not'} a known <span class="tooltip-bottom" data-tooltip="Virtual private network">VPN</span>)`;
    document.getElementById('isp').textContent = `${data.connection.isp_name} ${data.connection.isp_name !== data.connection.organization_name ? `(${data.connection.organization_name}) ` : ''}(${data.connection.connection_type})`;
    document.getElementById('location').textContent = `${data.city} (${data.postal_code}), ${data.region ? `${data.region}, ` : ''}${data.country}`;
    document.getElementById('latitude').textContent = data.latitude;
    document.getElementById('longitude').textContent = data.longitude;

    document.getElementById('reload-prompt').textContent = '';

    twemojiUpdate();
});
