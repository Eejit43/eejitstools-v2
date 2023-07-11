// More info about Geolocation API on https://app.abstractapi.com/api/ip-geolocation/documentation

/* eslint-disable @typescript-eslint/naming-convention */
interface IPInformation {
    ip_address: string;
    city: string;
    region?: string;
    country: string;
    postal_code: string;
    longitude: number;
    latitude: number;
    security: { is_vpn: boolean };
    connection: { isp_name: string; organization_name: string; connection_type: string };
}
/* eslint-enable @typescript-eslint/naming-convention */

fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=6b7d5eb7b17e420fbd0f8733e4b726fa').then(async (response) => {
    const data = (await response.json()) as IPInformation;

    (document.getElementById('ip-address') as HTMLSpanElement).innerHTML = `${data.ip_address} (${data.security.is_vpn ? 'Is' : 'Not'} a known <span class="tooltip-bottom" data-tooltip="Virtual private network">VPN</span>)`;
    (document.getElementById('isp') as HTMLSpanElement).textContent = `${data.connection.isp_name} ${data.connection.isp_name !== data.connection.organization_name ? `(${data.connection.organization_name}) ` : ''}(${data.connection.connection_type})`;
    (document.getElementById('location') as HTMLSpanElement).textContent = `${data.city} (${data.postal_code}), ${data.region ? `${data.region}, ` : ''}${data.country}`;
    (document.getElementById('latitude') as HTMLSpanElement).textContent = data.latitude.toString();
    (document.getElementById('longitude') as HTMLSpanElement).textContent = data.longitude.toString();

    (document.getElementById('reload-prompt') as HTMLSpanElement).textContent = '';
});
