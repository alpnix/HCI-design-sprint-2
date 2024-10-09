// Function to fetch and parse CSV data
async function fetchDataScatter() {
    const response = await fetch('MentalHealthSurvey.csv');
    const data = await response.text();
    
    
    // Parse the CSV data
    const parsedData = data.split('\n').slice(1).map(row => {
        const average_sleep =row.split(',')[10];
        return {
            x: parseFloat(average_sleep),
        };
    });

    return parsedData;
}

// Function to fetch and parse CSV data
async function fetchData() {
    const response = await fetch('MentalHealthSurvey.csv');
    const data = await response.text();

    // Parse the CSV data
    const parsedData = data.split('\n').slice(1).map(row => {
        const [average_sleep, cgpa] = [row.split(',')[10], row.split(',')[5]];
        return {
            x: parseFloat(average_sleep),
            y: parseFloat(cgpa)
        };
    });

    return parsedData;
}


// Function to create Chart.js scatter plot
async function createFirstScatterChart() {
    const dataPoints = await fetchData();

    const ctx = document.getElementById('scatterPlot').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Sleep vs. CGPA',
                data: dataPoints,
                backgroundColor: 'rgba(54, 162, 235, 0.13)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                pointRadius: 3
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Average Sleep (hours)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'CGPA'
                    }
                }
            }
        }
    });
}

async function createHisgoramChart () {
    const dataPoints = await fetchDataScatter();
    console.log(`dataPoints: ${dataPoints}`);

    
    var ctx = document.getElementById("histogram").getContext('2d');
var dataValues = [12, 19, 3, 5];
var dataLabels = [0, 2, 4, 16];
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: dataLabels,
    datasets: [{
      label: 'Group A',
      data: dataPoints["average_sleep"],
      backgroundColor: 'rgba(255, 99, 132, 1)',
    }]
  },
})
};

// Call the function to create the plot chart
createFirstScatterChart();


// Create how to do node.js to fingo
createHisgoramChart();