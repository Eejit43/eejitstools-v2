//More info about api data on https://app.abstractapi.com/api/ip-geolocation/documentation

fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=7dcea861f91a44579cea73ad833eff21')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        document.getElementById('ip-address').innerHTML = `${data.ip_address} (${data.security.is_vpn ? 'Is' : 'Not'} a <span class="tooltip-bottom" data-tooltip="Virtual private network">VPN</span><sup class="tooltip-top" style="text-decoration: none" data-tooltip="May not be accurate">*</sup>)`; // prettier-ignore
        document.getElementById('isp').innerHTML = `${data.connection.isp_name} ${data.connection.isp_name !== data.connection.organization_name ? `(${data.connection.organization_name}) ` : ''}(${data.connection.connection_type})`; // prettier-ignore
        document.getElementById('location').innerHTML = `${data.city} (${data.postal_code}), ${data.region ? `${data.region}, ` : ''}${data.country}`;
        document.getElementById('latitude').innerHTML = data.latitude;
        document.getElementById('longitude').innerHTML = data.longitude;

        document.getElementById('reloadprompt').innerHTML = '';

        twemojiUpdate();
    })
    .catch((err) => {});
