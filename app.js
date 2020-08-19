// Variable Declaration

const getDataButton = document.getElementById('get-data');
const table = document.getElementById('all-data');
const totalCases = document.getElementById('total-global');
const totalDeaths = document.getElementById('total-deaths');
const totalRecovered = document.getElementById('total-recovered');
const searchInput = document.getElementById('search-input');

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

    // Log Data to the console

    // console.log(jsonData);

    // Make title row for the table

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

            jsonData.forEach(value => {
                dateArray.push(value['Date']);
                casesArray.push(value['Confirmed']);
            })

            const data = [{
                x: dateArray,
                y: casesArray,
                type: 'scatter'
            }];

            const layout = {
                title: {
                    text: `${countryName}`,
                    font: {
                        family: 'sans-serif',
                        size: 18
                    },
                    xref: 'paper',
                    x: 0.05,
                },
                xaxis: {
                    title: {
                        text: 'Date',
                        font: {
                            family: 'sans-serif',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    },
                },
                yaxis: {
                    title: {
                        text: 'Covid Cases',
                        font: {
                            family: 'sans-serif',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    }
                }
            };

            Plotly.newPlot('graph', data, layout);

        })
    }

});


// window.addEventListener('load', async function () {

//     // Get Data Asynchronously

//     const response = await fetch('https://api.covid19api.com/dayone/country/south-africa');
//     const jsonData = await response.json();

//     // Log Data to the console

//     console.log(jsonData);
// });