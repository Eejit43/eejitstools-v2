fetch('https://v6.exchangerate-api.com/v6/822304e8ee8183e9de49f5df/latest/USD')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        rates = data.conversion_rates;

        document.getElementById('lastupdated').innerHTML = `${new Date(data.time_last_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(data.time_last_update_unix * 1000).toLocaleTimeString('en-US')}`; // prettier-ignore
        document.getElementById('nextupdate').innerHTML = `${new Date(data.time_next_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(data.time_next_update_unix * 1000).toLocaleTimeString('en-US')}`; // prettier-ignore
        document.getElementById('usdcad').innerHTML = `$${rates.CAD.toLocaleString()}`;
        document.getElementById('usdeur').innerHTML = `€${rates.EUR.toLocaleString()}`;
        document.getElementById('usdgbp').innerHTML = `£${rates.GBP.toLocaleString()}`;
        document.getElementById('usdaud').innerHTML = `$${rates.AUD.toLocaleString()}`;
        document.getElementById('usdcrc').innerHTML = `₡${rates.CRC.toLocaleString()}`;
        document.getElementById('usdjpy').innerHTML = `¥${rates.JPY.toLocaleString()}`;
        document.getElementById('cadusd').innerHTML = `$${(1 / rates.CAD.toLocaleString()).toLocaleString()}`;
        document.getElementById('eurusd').innerHTML = `$${(1 / rates.EUR.toLocaleString()).toLocaleString()}`;
        document.getElementById('gbpusd').innerHTML = `$${(1 / rates.GBP.toLocaleString()).toLocaleString()}`;
        document.getElementById('audusd').innerHTML = `$${(1 / rates.AUD.toLocaleString()).toLocaleString()}`;
        document.getElementById('crcusd').innerHTML = `$${(1 / rates.CRC.toLocaleString()).toLocaleString()}`;
        document.getElementById('jpyusd').innerHTML = `$${(1 / rates.JPY.toLocaleString()).toLocaleString()}`;
    })
    .catch((err) => {});
