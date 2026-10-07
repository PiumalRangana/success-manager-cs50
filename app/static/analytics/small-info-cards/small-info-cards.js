import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';

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

function formatActiveDays(activeDays, totalDays) {
    return `${formatNumber(activeDays, 0)} / ${formatNumber(totalDays, 0)}`;
}

function getComparisonPresentation(comparison) {
    if (!comparison || comparison.state === 'unchanged') {
        return { text: 'No change', state: 'neutral' };
    }

    if (comparison.state === 'new') {
        return { text: 'New', state: 'positive' };
    }

    if (comparison.change === 0) {
        return { text: 'No change', state: 'neutral' };
    }

    const direction = comparison.change > 0 ? 'up' : 'down';
    const percentage = Math.abs(comparison.percentageChange);

    return {
        text: `${direction === 'up' ? '↑' : '↓'} ${formatNumber(percentage, 0)}%`,
        state: direction === 'up' ? 'positive' : 'negative'
    };
}

function setCardChange(element, comparison) {
    const presentation = getComparisonPresentation(comparison);

    element.textContent = presentation.text;
    element.classList.remove(
        'metric-card-change--positive',
        'metric-card-change--negative',
        'metric-card-change--neutral'
    );
    element.classList.add(`metric-card-change--${presentation.state}`);
}

function clearCards(cards) {
    for (const card of Object.values(cards)) {
        card.value.textContent = '--';
        card.change.textContent = 'Loading…';
        card.change.className = 'metric-card-change metric-card-change--neutral';
    }
}

export function initializeSmallInfoCards() {
    const cards = {
        totalFocusTime: {
            value: document.getElementById('total-focus-time-value'),
            change: document.getElementById('total-focus-time-change')
        },
        averageDailyFocus: {
            value: document.getElementById('average-daily-focus-value'),
            change: document.getElementById('average-daily-focus-change')
        },
        totalSessions: {
            value: document.getElementById('total-sessions-value'),
            change: document.getElementById('total-sessions-change')
        },
        activeDays: {
            value: document.getElementById('active-days-value'),
            change: document.getElementById('active-days-change')
        },
        averageSessionLength: {
            value: document.getElementById('average-session-length-value'),
            change: document.getElementById('average-session-length-change')
        }
    };

    function updateCards(dashboard = getAnalyticsDashboard()) {
        if (!dashboard) {
            clearCards(cards);
            return;
        }

        const selected = dashboard.periods.selected.stats;
        const comparison = dashboard.comparisons.previousToSelected.metrics;

        cards.totalFocusTime.value.textContent = formatMinutes(
            selected.summary.totalFocusMinutes
        );
        setCardChange(cards.totalFocusTime.change, comparison.totalFocusMinutes);

        cards.averageDailyFocus.value.textContent = formatMinutes(
            selected.summary.averageDailyFocusMinutes
        );
        setCardChange(
            cards.averageDailyFocus.change,
            comparison.averageDailyFocusMinutes
        );

        cards.totalSessions.value.textContent = formatNumber(
            selected.summary.totalSessions,
            0
        );
        setCardChange(cards.totalSessions.change, comparison.totalSessions);

        cards.activeDays.value.textContent = formatActiveDays(
            selected.summary.activeDays,
            selected.range.dayCount
        );
        setCardChange(cards.activeDays.change, comparison.activeDays);

        cards.averageSessionLength.value.textContent = formatMinutes(
            selected.summary.averageSessionLengthMinutes
        );
        setCardChange(
            cards.averageSessionLength.change,
            comparison.averageSessionLengthMinutes
        );
    }

    updateCards();

    return subscribeToAnalyticsDashboardChanges(updateCards);
}
