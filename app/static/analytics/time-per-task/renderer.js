export function renderTimePerTaskDonutChart(convertedData) {

    const ctx = document.getElementById('time-per-task-canvas');

    const labels = [];
    const dataValues = [];
    const backgroundColors = [];

    // Object.entries creates [key, value] pairs in a single iteration
    Object.entries(convertedData).forEach(([key, item]) => {
        labels.push(key);
        dataValues.push(item.duration);
        backgroundColors.push(item.color);
    });

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    })
};
