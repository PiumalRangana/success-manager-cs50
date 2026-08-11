export function renderBarChart(barChartData) {

    const ctx = document.getElementById('total-focus-bar-chart-canvas');

    Chart.register(ChartDataLabels);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(barChartData).map(label => {
                let [year, month, day] = label.split('-');
                const date = new Date(year, month - 1, day);
                const monthName = date.toLocaleString('en-US', { month: 'short' });
                return `${monthName} ${day}`;
            }),
            datasets: [{
                label: 'Focus Time',
                data: Object.values(barChartData),
                backgroundColor: '#2b66f6',
                borderRadius: 6,
                borderSkipped: 'bottom'
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = Math.round(context.raw);
                            const h = Math.floor(value / 60);
                            const m = value % 60;
                            return `Focus Time: ${h}h ${m}m`;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true,
                        pointStyle: 'rect'
                    }
                },

                datalabels: {
                    display: (context) => context.chart.data.labels.length <= 14,
                    anchor: 'end',
                    align: 'end',
                    offset: 4,
                    color: '#ffffff',
                    font: {
                        size: 13,
                        weight: '500'
                    },
                    formatter: (value) => {
                        const totalMinutes = Math.round(value);
                        const h = Math.floor(totalMinutes / 60);
                        const m = totalMinutes % 60;

                        return m > 0 ? `${h}h ${m}m` : `${h}h`;
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false // Removes vertical lines
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)',
                        borderDash: [4, 4] // Dashed horizontal lines
                    },
                    ticks: {
                        color: '#9ca3af',
                        stepSize: 120, // 2-hour increments
                        callback: (value) => `${value / 60}h`
                    }
                }
            }
        }
    });
}