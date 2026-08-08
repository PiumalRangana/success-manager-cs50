// receive data from data-pipe-line.js and render the bar chart using chart.js
export function renderBarChart(barChartData) {
    console.log('barChartData in total-focuse-bar-chart.js Renderer:', barChartData);

    const ctx = document.getElementById('total-focus-bar-chart-canvas');

    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(barChartData),
            datasets: [{
                label: 'Total Focus Time (minutes)',
                data: Object.values(barChartData),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    return chart;
}