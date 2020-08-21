// Variable Declaration

const getDataButton = document.getElementById('get-data');
const table = document.getElementById('all-data');
const totalCases = document.getElementById('total-global');
const totalDeaths = document.getElementById('total-deaths');
const totalRecovered = document.getElementById('total-recovered');
const searchInput = document.getElementById('search-input');
const covidPlot = document.getElementById('inner-graph').getContext('2d');

const url = 'https://api.covid19api.com/summary';


// Function to add commas to numbers

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

// Search input event listener

searchInput.addEventListener('keyup', (e) => {
    let value = e.target.value;
    table.querySelectorAll('tr').forEach((tr, i) => {
        let country = tr.querySelector('td');
        // console.log(tr.style.display)
        if (!country.innerText.toLowerCase().includes(value.toLowerCase()) && i !== 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = 'table-row';
        }
    })
})

// Load Covid data upon loading app asynchronously

window.addEventListener('load', async function () {

    // Get Data Asynchronously

    const response = await fetch(url);
    const jsonData = await response.json();

    let firstRow = document.createElement('tr');
    firstRow.innerHTML = `
        <td style="font-weight: bold; background-color: #6E7CD8; color: white; text-align: left; padding-left: 2em; border-top-left-radius: 20px;">Country</td>
        <td style="font-weight: bold; background-color: #6E7CD8; color: white; ">Total Cases</td>
        <td style="font-weight: bold; background-color: #6E7CD8; color: white; ">Total Deaths</td>
        <td style="font-weight: bold; background-color: #6E7CD8; color: white; border-top-right-radius: 20px;">Total Recovered</td>
        `
    table.appendChild(firstRow);

    // Loop through data and populate the table

    jsonData.Countries.forEach(country => {
        let newEl = document.createElement('tr');
        newEl.setAttribute('data-slug', country.Slug);
        newEl.setAttribute('data-country', country.Country)
        newEl.innerHTML = `
        <td class="country">${country.Country}</td>
        <td>${numberWithCommas(country.TotalConfirmed)}</td>
        <td>${numberWithCommas(country.TotalDeaths)}</td>
        <td>${numberWithCommas(country.TotalRecovered)}</td>
        `
        table.appendChild(newEl);
    });

    // Populate summary stats

    totalCases.innerHTML = numberWithCommas(jsonData.Global.TotalConfirmed);
    totalDeaths.innerHTML = numberWithCommas(jsonData.Global.TotalDeaths);
    totalRecovered.innerHTML = numberWithCommas(jsonData.Global.TotalRecovered);

    const countryRows = table.querySelectorAll('tr');

    for (let i = 1; i < Array(...countryRows).length; i++) {
        const dateArray = [];
        const casesArray = [];
        Array(...countryRows)[i].addEventListener('click', async function () {
            let slug = Array(...countryRows)[i].getAttribute('data-slug');
            let countryName = Array(...countryRows)[i].getAttribute('data-country');
            const response = await fetch(`https://api.covid19api.com/dayone/country/${slug}`);
            const jsonData = await response.json();

            // Gather date and covid cases data into an array 

            jsonData.forEach(value => {
                dateArray.push(value['Date']);
                casesArray.push(value['Confirmed']);
            })

            // Configure the x and y axis data

            const data = {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }

            // Configure options

            const options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

            // Plot data using Chart.js

            const graph = new Chart(covidPlot, {
                type: 'line',
                data: data,
                options: options
            });

        })
    }

});