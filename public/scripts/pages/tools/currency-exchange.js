fetch('https://v6.exchangerate-api.com/v6/822304e8ee8183e9de49f5df/latest/usd').then(async (response) => {
    const data = await response.json();
    const rates = data.conversion_rates;

    document.getElementById('last-updated').textContent = `${new Date(data.time_last_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(data.time_last_update_unix * 1000).toLocaleTimeString('en-US')}`;
    document.getElementById('next-update').textContent = `${new Date(data.time_next_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(data.time_next_update_unix * 1000).toLocaleTimeString('en-US')}`;
    document.getElementById('usd-cad').textContent = `$${rates.CAD.toLocaleString()}`;
    document.getElementById('usd-eur').textContent = `€${rates.EUR.toLocaleString()}`;
    document.getElementById('usd-gbp').textContent = `£${rates.GBP.toLocaleString()}`;
    document.getElementById('usd-aud').textContent = `$${rates.AUD.toLocaleString()}`;
    document.getElementById('usd-crc').textContent = `₡${rates.CRC.toLocaleString()}`;
    document.getElementById('usd-jpy').textContent = `¥${rates.JPY.toLocaleString()}`;
    document.getElementById('cad-usd').textContent = `$${(1 / rates.CAD.toLocaleString()).toLocaleString()}`;
    document.getElementById('eur-usd').textContent = `$${(1 / rates.EUR.toLocaleString()).toLocaleString()}`;
    document.getElementById('gbp-usd').textContent = `$${(1 / rates.GBP.toLocaleString()).toLocaleString()}`;
    document.getElementById('aud-usd').textContent = `$${(1 / rates.AUD.toLocaleString()).toLocaleString()}`;
    document.getElementById('crc-usd').textContent = `$${(1 / rates.CRC.toLocaleString()).toLocaleString()}`;
    document.getElementById('jpy-usd').textContent = `$${(1 / rates.JPY.toLocaleString()).toLocaleString()}`;
});
