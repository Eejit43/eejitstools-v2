// More info about Geolocation API on https://app.abstractapi.com/api/ip-geolocation/documentation

fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=6b7d5eb7b17e420fbd0f8733e4b726fa').then(async (response) => {
    const data = await response.json();

    document.getElementById('ip-address').innerHTML = `${data.ip_address} (${data.security.is_vpn ? 'Is' : 'Not'} a known <span class="tooltip-bottom" data-tooltip="Virtual private network">VPN</span>)`;
    document.getElementById('isp').textContent = `${data.connection.isp_name} ${data.connection.isp_name !== data.connection.organization_name ? `(${data.connection.organization_name}) ` : ''}(${data.connection.connection_type})`;
    document.getElementById('location').textContent = `${data.city} (${data.postal_code}), ${data.region ? `${data.region}, ` : ''}${data.country}`;
    document.getElementById('latitude').textContent = data.latitude;
    document.getElementById('longitude').textContent = data.longitude;

    document.getElementById('reload-prompt').textContent = '';
});
