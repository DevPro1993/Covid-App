const getDataButton = document.getElementById('get-data');
const table = document.getElementById('all-data');
const totalCases = document.getElementById('total-global');
const totalDeaths = document.getElementById('total-deaths');
const totalRecovered = document.getElementById('total-recovered');
const searchInput = document.getElementById('search-input');

const url = 'https://api.covid19api.com/summary';

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

searchInput.addEventListener('keyup', (e) => {
    let value = e.target.value;

    table.querySelectorAll('tr').forEach((tr,i) => {
        let country = tr.querySelector('td');
        // console.log(tr.style.display)
        if (!country.innerText.toLowerCase().includes(value.toLowerCase()) && i !== 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = 'table-row';
        }
    })
})


window.addEventListener('load', async function () {

    const response = await fetch(url);
    const jsonData = await response.json();
    console.log(jsonData);

    let firstRow = document.createElement('tr');
    firstRow.innerHTML = `
        <td style="font-weight: bold; font-size: 1.2rem;">Country</td>
        <td style="font-weight: bold; font-size: 1.2rem;">Total Cases</td>
        <td style="font-weight: bold; font-size: 1.2rem;">Total Deaths</td>
        <td style="font-weight: bold; font-size: 1.2rem;">Total Recovered</td>
        `

    table.appendChild(firstRow);

    jsonData.Countries.forEach(country => {




        let newEl = document.createElement('tr');
        newEl.innerHTML = `
        <td>${country.Country}</td>
        <td>${numberWithCommas(country.TotalConfirmed)}</td>
        <td>${numberWithCommas(country.TotalDeaths)}</td>
        <td>${numberWithCommas(country.TotalRecovered)}</td>
        `
        table.appendChild(newEl);
    });

    totalCases.innerHTML = numberWithCommas(jsonData.Global.TotalConfirmed);
    totalDeaths.innerHTML = numberWithCommas(jsonData.Global.TotalDeaths);
    totalRecovered.innerHTML = numberWithCommas(jsonData.Global.TotalRecovered);
});