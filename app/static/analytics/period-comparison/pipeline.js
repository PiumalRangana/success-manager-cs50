const FULL_METRICS = [
    { id: 'totalFocusMinutes', label: 'Focus Time', format: 'minutes' },
    { id: 'activeDays', label: 'Active Days', format: 'activeDays' },
    { id: 'activeDayRate', label: 'Active-day Rate', format: 'percentage' },
    { id: 'averageSessionLengthMinutes', label: 'Average Session Length', format: 'minutes' },
    { id: 'totalSessions', label: 'Total Sessions', format: 'count' }
];

const NORMALIZED_METRICS = [
    { id: 'activeDayRate', label: 'Active-day Rate', format: 'percentage' },
    { id: 'averageDailyFocusMinutes', label: 'Average Daily Focus', format: 'minutes' },
    { id: 'averageSessionLengthMinutes', label: 'Average Session Length', format: 'minutes' },
    { id: 'sessionsPerDay', label: 'Sessions per Day', format: 'decimal' }
];

function formatNumber(value, maximumFractionDigits = 1) {
    return new Intl.NumberFormat(undefined, {
        maximumFractionDigits
    }).format(value);
}

function formatMinutes(minutes) {
    const roundedMinutes = Math.round(minutes);

    if (roundedMinutes < 60) {
        return `${formatNumber(minutes)} min`;
    }

    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = roundedMinutes % 60;

    return remainingMinutes === 0
        ? `${hours} hr`
        : `${hours} hr ${remainingMinutes} min`;
}

function formatDateRange(startDate, endDate) {
    const formatDate = dateLabel => new Date(`${dateLabel}T00:00:00`).toLocaleDateString(
        undefined,
        { month: 'short', day: 'numeric' }
    );

    return startDate === endDate
        ? formatDate(startDate)
        : `${formatDate(startDate)} To ${formatDate(endDate)}`;
}

function formatValue(metric, value, period) {
    switch (metric.format) {
        case 'minutes':
            return formatMinutes(value);
        case 'activeDays':
            return `${formatNumber(value, 0)} / ${period.stats.range.dayCount}`;
        case 'percentage':
            return `${formatNumber(value)}%`;
        case 'count':
            return formatNumber(value, 0);
        case 'decimal':
            return formatNumber(value);
        default:
            return formatNumber(value);
    }
}

function buildRows(comparison, fromPeriod, toPeriod) {
    const metrics = comparison.mode === 'normalized'
        ? NORMALIZED_METRICS
        : FULL_METRICS;

    return metrics.map(metric => {
        const values = comparison.metrics[metric.id];

        return {
            label: metric.label,
            from: formatValue(metric, values.from, fromPeriod),
            to: formatValue(metric, values.to, toPeriod),
            change: values
        };
    });
}

export function buildPeriodComparisonView(dashboard, target = 'previous') {
    const hasCurrentPeriod = Boolean(dashboard.periods.present);
    const showCurrentPeriod = target === 'current' && hasCurrentPeriod;
    const comparison = showCurrentPeriod
        ? dashboard.comparisons.selectedToPresent
        : dashboard.comparisons.previousToSelected;
    const fromPeriod = showCurrentPeriod
        ? dashboard.periods.selected
        : dashboard.periods.previous;
    const toPeriod = showCurrentPeriod
        ? dashboard.periods.present
        : dashboard.periods.selected;
    const currentPeriodDescription = showCurrentPeriod
        ? comparison.mode === 'full'
            ? `Current period: ${formatDateRange(toPeriod.startDate, toPeriod.endDate)} - same length`
            : `Current period so far: ${formatDateRange(toPeriod.startDate, toPeriod.endDate)} - ${toPeriod.stats.range.dayCount} of ${fromPeriod.stats.range.dayCount} days`
        : 'How your stats changed from the previous period';

    return {
        target: showCurrentPeriod ? 'current' : 'previous',
        hasCurrentPeriod,
        mode: comparison.mode,
        description: currentPeriodDescription,
        headers: showCurrentPeriod
            ? { from: 'Selected', to: 'Current' }
            : { from: 'Previous', to: 'Selected' },
        rows: buildRows(comparison, fromPeriod, toPeriod)
    };
}
