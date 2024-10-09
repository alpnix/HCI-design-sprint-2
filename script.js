// Function to fetch and parse CSV data
async function fetchDataHistogram() {
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
async function fetchDataMultiLine() {
    const response = await fetch('MentalHealthSurvey.csv');
    const data = await response.text();

    // Parse the CSV data
    const parsedData = data.split('\n').slice(1).map(row => {
        const [study_satisfaction,academic_workload,academic_pressure,financial_concerns,social_relationships,depression,anxiety,isolation,future_insecurity] = [11,12,13,14,15,16,17,18,19].forEach(num => row.split(',')[num]);
        return [{
            x: parseFloat(financial_concerns),
            y: parseFloat(study_satisfaction)
        }, 
        {
            x: parseFloat(financial_concerns),
            y: parseFloat(academic_workload)
        }, 
        {
            x: parseFloat(financial_concerns),
            y: parseFloat(academic_pressure)
        }, 
        {
            x: parseFloat(financial_concerns),
            y: parseFloat(social_relationships)
        }, 
        {
            x: parseFloat(financial_concerns),
            y: parseFloat(anxiety)
        }];
    });

    return parsedData;
}

// Function to fetch and parse CSV data
async function fetchDataScatter() {
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


// Function to fetch and parse CSV data
async function fetchDataScatter2() {
    const response = await fetch('MentalHealthSurvey.csv');
    const data = await response.text();

    // Parse the CSV data
    const parsedData = data.split('\n').slice(1).map(row => {
        const [sports_engagement, depression] = [row.split(',')[9], row.split(',')[16]];
        return {
            x: parseFloat(sports_engagement),
            y: parseFloat(depression)
        };
    });

    return parsedData;
}

// Function to fetch and parse CSV data
async function fetchDataScatter21() {
    const response = await fetch('MentalHealthSurvey.csv');
    const data = await response.text();

    // Parse the CSV data
    const parsedData = data.split('\n').slice(1).map(row => {
        const [sports_engagement, cgpa] = [row.split(',')[9], row.split(',')[5]];
        return {
            x: parseFloat(sports_engagement),
            y: parseFloat(cgpa)
        };
    });

    return parsedData;
}


// Function to create Chart.js scatter plot
async function createFirstScatterChart() {
    const dataPoints = await fetchDataScatter();

    const ctx = document.getElementById('alp-scatterPlot').getContext('2d');
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


// Function to create Chart.js scatter plot
async function createBarChart() {
    const dataPoints = await fetchDataScatter2();
    const otherDataPoints = await fetchDataScatter21(); 

    const ctx = document.getElementById('alp-scatterPlot2').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Sports Engagement vs. Depression',
                data: dataPoints,
                backgroundColor: 'rgba(75, 192, 75, 0.13)',
                borderColor: 'rgba(75, 192, 75, 1)',
                borderWidth: 1,
                pointRadius: 3
            }, 
            {
                label: 'Sports Engagement vs. CGPA',
                data: otherDataPoints,
                backgroundColor: 'rgba(0, 0, 0, 0.13)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
                pointRadius: 3
            } ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Sports Engagement (times/week)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Depression Score and CGPA'
                    }
                }
            }
        }
    });
}

// Function to create histogram data
function createHistogramData(data, numBins) {
    // Define the range and bin width
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;

    // Create bins and count frequencies
    const bins = Array(numBins).fill(0);
    data.forEach(value => {
        const binIndex = Math.min(
            numBins - 1,
            Math.floor((value - min) / binWidth)
        );
        bins[binIndex]++;
    });

    // Create labels for each bin
    const labels = bins.map((_, i) => {
        const binStart = (min + i * binWidth).toFixed(1);
        const binEnd = (min + (i + 1) * binWidth).toFixed(1);
        return `${binStart} - ${binEnd}`;
    });

    return { labels, bins };
}

// Function to create Chart.js histogram
async function createHistogram() {
    const sleepData = await fetchDataHistogram();
    const sleepHours = sleepData.map(d => d.x);
    const numBins = 5; // Adjust the number of bins as needed
    const histogramData = createHistogramData(sleepHours, numBins);

    const ctx = document.getElementById('alp-histogram').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: histogramData.labels,
            datasets: [{
                label: 'Frequency of Average Sleep',
                data: histogramData.bins,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Average Sleep (hours)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}


// Function to create Chart.js multi-line chart
async function createMultiLineChart() {
    const dataPoints = await fetchDataMultiLine();
    console.log(dataPoints);
    const ctx = document.getElementById('alp-lineplot').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Sports Engagement vs. Depression',
                data: dataPoints,
                backgroundColor: 'rgba(75, 192, 75, 0.13)',
                borderColor: 'rgba(75, 192, 75, 1)',
                borderWidth: 1,
                pointRadius: 3
            }, 
            {
                label: 'Sports Engagement vs. CGPA',
                data: otherDataPoints,
                backgroundColor: 'rgba(0, 0, 0, 0.13)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
                pointRadius: 3
            } ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Sports Engagement (times/week)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Depression Score and CGPA'
                    }
                }
            }
        }
    });
}




// Call the function to create the histogram
createHistogram();


// Call the function to create the plot chart
createFirstScatterChart();


// Call the function to create the plot chart
createBarChart();


// Call the function to create multi-line chart
createMultiLineChart();