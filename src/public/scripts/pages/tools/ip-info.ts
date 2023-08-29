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

const ipInfo = document.querySelector('#ip-info') as HTMLDivElement;

// eslint-disable-next-line unicorn/prefer-top-level-await
fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=6b7d5eb7b17e420fbd0f8733e4b726fa').then(async (response) => {
    const data = (await response.json()) as IPInformation;

    const output = [
        { icon: 'network-wired', name: 'IP Address', value: `${data.ip_address}` },
        {
            icon: 'house-signal',
            name: 'ISP',
            nameTooltip: 'Internet Service Provider',
            value: `${data.connection.isp_name} ${data.connection.isp_name === data.connection.organization_name ? '' : `(${data.connection.organization_name}) `}(${data.connection.connection_type})`,
        },
        { icon: 'location-dot', name: 'Location', value: `${data.city} (${data.postal_code}), ${data.region ? `${data.region}, ` : ''}${data.country}` },
        { icon: 'globe', name: 'Latitude (north-south)', value: data.latitude.toString() },
        { icon: 'globe', name: 'Longitude (east-west)', value: data.longitude.toString() },
    ];

    ipInfo.innerHTML = '';

    for (const item of output) {
        const row = document.createElement('div');

        const icon = document.createElement('i');
        icon.className = `fa-regular fa-${item.icon}`;

        row.append(icon, ' ');

        if (item.nameTooltip) {
            const tooltip = document.createElement('span');
            tooltip.textContent = item.name;
            tooltip.dataset.tooltip = item.nameTooltip;

            row.append(tooltip);
        } else row.append(item.name);

        const value = document.createElement('span');
        value.textContent = item.value.trim();

        row.append(': ', value);

        ipInfo.append(row);
    }

    // (document.querySelector('#ip-address') as HTMLSpanElement).innerHTML = `${data.ip_address} (${
    //     data.security.is_vpn ? 'Is' : 'Not'
    // } a known <span class="tooltip-bottom" data-tooltip="Virtual private network">VPN</span>)`;
    // (document.querySelector('#isp') as HTMLSpanElement).textContent = `${data.connection.isp_name} ${
    //     data.connection.isp_name === data.connection.organization_name ? '' : `(${data.connection.organization_name}) `
    // }(${data.connection.connection_type})`;
    // (document.querySelector('#location') as HTMLSpanElement).textContent = `${data.city} (${data.postal_code}), ${data.region ? `${data.region}, ` : ''}${data.country}`;
    // (document.querySelector('#latitude') as HTMLSpanElement).textContent = data.latitude.toString();
    // (document.querySelector('#longitude') as HTMLSpanElement).textContent = data.longitude.toString();

    // (document.querySelector('#reload-prompt') as HTMLDivElement).textContent = '';
});
