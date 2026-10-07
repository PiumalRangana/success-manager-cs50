export function renderTimePerTaskDonutChart(convertedData) {

    // Convert task data into the arrays Chart.js expects and calculate the total.
    const ctx = document.getElementById('time-per-task-canvas');

    const labels = [];
    const dataValues = [];
    const backgroundColors = [];

    convertedData.forEach((item) => {
        labels.push(item.name);
        dataValues.push(item.duration);
        backgroundColors.push(item.color || '#8fa0b8');
    });

    const totalMinutes = dataValues.reduce((total, value) => total + value, 0);

    renderTimePerTaskLegend(labels, dataValues, backgroundColors, totalMinutes);

    // Render the donut without Chart.js's built-in legend; the custom legend is below.
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: '#101950',
                borderWidth: 0.3
            }]
        },
        plugins: [centerTotalPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
                centerTotal: {
                    totalText: formatDuration(totalMinutes),
                    labelText: 'Total'
                },
                datalabels: {
                    display: false
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.raw;
                            const percentage = formatPercentage(value, totalMinutes);

                            return `${formatDuration(value)} (${percentage})`;
                        }
                    }
                }
            }
        }
    })
};

// Draw the total focus time in the center of the doughnut chart.
const centerTotalPlugin = {
    id: 'centerTotal',
    afterDraw(chart, args, options) {
        const { ctx, chartArea } = chart;
        const firstArc = chart.getDatasetMeta(0).data[0];
        const centerX = firstArc ? firstArc.x : (chartArea.left + chartArea.right) / 2;
        const centerY = firstArc ? firstArc.y : (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#e5e7eb';
        ctx.font = '600 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(options.totalText, centerX, centerY - 7);

        ctx.fillStyle = '#9ca3af';
        ctx.font = '400 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(options.labelText, centerX, centerY + 18);

        ctx.restore();
    }
};

function renderTimePerTaskLegend(labels, dataValues, backgroundColors, totalMinutes) {
    const legend = document.getElementById('time-per-task-legend');

    if (!legend) {
        return;
    }

    legend.innerHTML = '';

    if (!labels.length || totalMinutes <= 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'time-per-task-empty';
        emptyMessage.textContent = 'No focus time in this range';
        legend.appendChild(emptyMessage);
        return;
    }

    // Build an accessible custom legend with hover and click-to-pin task names.
    labels.forEach((label, index) => {
        const row = document.createElement('div');
        row.className = 'time-per-task-legend-row';

        const colorDot = document.createElement('span');
        colorDot.className = 'time-per-task-legend-color';
        colorDot.style.backgroundColor = backgroundColors[index];

        const name = document.createElement('span');
        name.className = 'time-per-task-legend-name';
        name.textContent = label;
        name.tabIndex = 0;

        name.addEventListener('mouseenter', () => {
            showTaskNameTooltip(name, label);
        });

        name.addEventListener('mouseleave', () => {
            if (!name.classList.contains('active')) {
                hideTaskNameTooltip();
            }
        });

        name.addEventListener('focus', () => {
            showTaskNameTooltip(name, label);
        });

        name.addEventListener('blur', () => {
            if (!name.classList.contains('active')) {
                hideTaskNameTooltip();
            }
        });

        name.addEventListener('click', (event) => {
            event.stopPropagation();
            const isActive = name.classList.toggle('active');

            document.querySelectorAll('.time-per-task-legend-name.active').forEach((el) => {
                if (el !== name) {
                    el.classList.remove('active');
                }
            });

            if (isActive) {
                showTaskNameTooltip(name, label);
                document.addEventListener('click', closeActiveTaskNameTooltip, { once: true });
                return;
            }

            hideTaskNameTooltip();
        });

        const duration = document.createElement('span');
        duration.className = 'time-per-task-legend-duration';
        duration.textContent = formatDuration(dataValues[index]);

        const percentage = document.createElement('span');
        percentage.className = 'time-per-task-legend-percentage';
        percentage.textContent = formatPercentage(dataValues[index], totalMinutes);

        row.append(colorDot, name, duration, percentage);
        legend.appendChild(row);
    });
}

function formatDuration(minutes) {
    const totalMinutes = Math.round(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
    }

    if (hours > 0) {
        return `${hours}h`;
    }

    return `${remainingMinutes}m`;
}

function formatPercentage(value, total) {
    if (total <= 0) {
        return '0%';
    }

    return `${((value / total) * 100).toFixed(1)}%`;
}

// Create the shared tooltip lazily so the DOM stays clean until it is needed.
function getTaskNameTooltip() {
    let tooltip = document.getElementById('time-per-task-name-tooltip');

    if (tooltip) {
        return tooltip;
    }

    tooltip = document.createElement('div');
    tooltip.id = 'time-per-task-name-tooltip';
    tooltip.className = 'time-per-task-name-tooltip';
    document.body.appendChild(tooltip);

    return tooltip;
}

function showTaskNameTooltip(anchor, text) {
    const tooltip = getTaskNameTooltip();
    const anchorRect = anchor.getBoundingClientRect();

    tooltip.textContent = text;
    tooltip.classList.add('visible');

    // Position the tooltip above the legend item while keeping it in the viewport.
    const tooltipRect = tooltip.getBoundingClientRect();
    const top = Math.max(8, anchorRect.top - tooltipRect.height - 8);
    const left = Math.min(
        window.innerWidth - tooltipRect.width - 8,
        Math.max(8, anchorRect.left)
    );

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

function hideTaskNameTooltip() {
    const tooltip = document.getElementById('time-per-task-name-tooltip');

    if (!tooltip) {
        return;
    }

    tooltip.classList.remove('visible');
}

function closeActiveTaskNameTooltip() {
    document.querySelectorAll('.time-per-task-legend-name.active').forEach((name) => {
        name.classList.remove('active');
    });

    hideTaskNameTooltip();
}
