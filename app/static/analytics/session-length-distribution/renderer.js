function formatPercentage(value) {
    return `${Math.round(value)}%`;
}

export function renderSessionLengthDistribution(chartData) {
    const ctx = document.getElementById('session-length-distribution-canvas');
    const highestPercentage = Math.max(0, ...chartData.percentages);
    const suggestedMaximum = Math.max(10, Math.ceil(highestPercentage / 10) * 10 + 10);

    Chart.register(ChartDataLabels);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Sessions',
                data: chartData.percentages,
                backgroundColor: '#7c5cff',
                hoverBackgroundColor: '#967dff',
                borderRadius: 5,
                borderSkipped: 'bottom'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: context => {
                            const count = chartData.counts[context.dataIndex] || 0;
                            const sessions = count === 1 ? 'session' : 'sessions';

                            return `${formatPercentage(context.raw)} (${count} ${sessions})`;
                        }
                    }
                },
                datalabels: {
                    display: context => context.raw > 0,
                    anchor: 'end',
                    align: 'end',
                    offset: 4,
                    color: '#ffffff',
                    font: {
                        size: 12,
                        weight: '600'
                    },
                    formatter: value => formatPercentage(value)
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: suggestedMaximum,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)',
                        borderDash: [4, 4]
                    },
                    ticks: {
                        color: '#9ca3af',
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}
