fetch('https://v6.exchangerate-api.com/v6/822304e8ee8183e9de49f5df/latest/usd').then(async (response) => {
    const data = await response.json();
    const rates = data.conversion_rates;

    document.getElementById('last-updated').innerHTML = `${new Date(data.time_last_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(data.time_last_update_unix * 1000).toLocaleTimeString('en-US')}`;
    document.getElementById('next-update').innerHTML = `${new Date(data.time_next_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(data.time_next_update_unix * 1000).toLocaleTimeString('en-US')}`;
    document.getElementById('usd-cad').innerHTML = `$${rates.CAD.toLocaleString()}`;
    document.getElementById('usd-eur').innerHTML = `€${rates.EUR.toLocaleString()}`;
    document.getElementById('usd-gbp').innerHTML = `£${rates.GBP.toLocaleString()}`;
    document.getElementById('usd-aud').innerHTML = `$${rates.AUD.toLocaleString()}`;
    document.getElementById('usd-crc').innerHTML = `₡${rates.CRC.toLocaleString()}`;
    document.getElementById('usd-jpy').innerHTML = `¥${rates.JPY.toLocaleString()}`;
    document.getElementById('cad-usd').innerHTML = `$${(1 / rates.CAD.toLocaleString()).toLocaleString()}`;
    document.getElementById('eur-usd').innerHTML = `$${(1 / rates.EUR.toLocaleString()).toLocaleString()}`;
    document.getElementById('gbp-usd').innerHTML = `$${(1 / rates.GBP.toLocaleString()).toLocaleString()}`;
    document.getElementById('aud-usd').innerHTML = `$${(1 / rates.AUD.toLocaleString()).toLocaleString()}`;
    document.getElementById('crc-usd').innerHTML = `$${(1 / rates.CRC.toLocaleString()).toLocaleString()}`;
    document.getElementById('jpy-usd').innerHTML = `$${(1 / rates.JPY.toLocaleString()).toLocaleString()}`;
});
