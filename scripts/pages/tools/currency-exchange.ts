fetch('https://v6.exchangerate-api.com/v6/822304e8ee8183e9de49f5df/latest/usd').then(async (response) => {
    const data = (await response.json()) as { time_last_update_unix: number; time_next_update_unix: number; conversion_rates: { [key: string]: number } }; // eslint-disable-line @typescript-eslint/naming-convention
    const rates = data.conversion_rates;

    (document.getElementById('last-updated') as HTMLSpanElement).textContent = `${new Date(data.time_last_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(data.time_last_update_unix * 1000).toLocaleTimeString('en-US')}`;
    (document.getElementById('usd-cad') as HTMLSpanElement).textContent = `$${rates.CAD.toLocaleString()}`;
    (document.getElementById('usd-eur') as HTMLSpanElement).textContent = `€${rates.EUR.toLocaleString()}`;
    (document.getElementById('usd-gbp') as HTMLSpanElement).textContent = `£${rates.GBP.toLocaleString()}`;
    (document.getElementById('usd-aud') as HTMLSpanElement).textContent = `$${rates.AUD.toLocaleString()}`;
    (document.getElementById('usd-crc') as HTMLSpanElement).textContent = `₡${rates.CRC.toLocaleString()}`;
    (document.getElementById('usd-jpy') as HTMLSpanElement).textContent = `¥${rates.JPY.toLocaleString()}`;
    (document.getElementById('cad-usd') as HTMLSpanElement).textContent = `$${(1 / rates.CAD).toLocaleString()}`;
    (document.getElementById('eur-usd') as HTMLSpanElement).textContent = `$${(1 / rates.EUR).toLocaleString()}`;
    (document.getElementById('gbp-usd') as HTMLSpanElement).textContent = `$${(1 / rates.GBP).toLocaleString()}`;
    (document.getElementById('aud-usd') as HTMLSpanElement).textContent = `$${(1 / rates.AUD).toLocaleString()}`;
    (document.getElementById('crc-usd') as HTMLSpanElement).textContent = `$${(1 / rates.CRC).toLocaleString()}`;
    (document.getElementById('jpy-usd') as HTMLSpanElement).textContent = `$${(1 / rates.JPY).toLocaleString()}`;
});
