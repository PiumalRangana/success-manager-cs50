export function renderTimeDistributionChart(groupedByHourData) {

    const ctx = document.getElementById('time-distribution-bar-chart-canvas');

    Chart.register(ChartDataLabels);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: groupedByHourData.labels,
            datasets: [{
                label: 'Focus Time',
                data: groupedByHourData.data,
                backgroundColor: '#704EB7',
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
                            let tooltipTime = h ? `Focus Time: ${h}h ${m}m` : `Focus Time: ${m}m`
                            return tooltipTime;
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
                        if (h > 0 && m > 0) {
                            return `${h}h ${m}m`
                        }
                        else if (m > 0) {
                            return `${m}m`
                        }
                        else {
                            return `${h}h`
                        }
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
                        stepSize: 60,
                        callback: (value) => `${value / 60}h`
                    }
                }
            }
        }
    });
}