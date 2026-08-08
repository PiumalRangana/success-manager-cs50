import { getAnalyticsDateRange } from '../analyticsStore.js';

function parseDateLabel(dateLabel) {
    if (!dateLabel) {
        return null;
    }

    const [year, month, day] = dateLabel.split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
}

function formatDateLabel(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getNextLocalMidnight(date) {
    const nextMidnight = new Date(date);
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(nextMidnight.getDate() + 1);

    return nextMidnight;
}

// label maker
function generateDefaultLabels(startDate, endDate) {
    const labels = [];

    const rangeStart = parseDateLabel(startDate);
    const rangeEnd = parseDateLabel(endDate);

    if (!rangeStart || !rangeEnd || rangeStart > rangeEnd) {
        return labels;
    }

    for (let currentDate = new Date(rangeStart); currentDate <= rangeEnd; currentDate.setDate(currentDate.getDate() + 1)) {
        labels.push(formatDateLabel(currentDate));
    }
    return labels;
}



// make a data object from sessions that can be directly used in chart.js bar charts
export function getBarChartData(sessions) {

    const { startDate, endDate } = getAnalyticsDateRange();
    const labels = generateDefaultLabels(startDate, endDate);
    const rangeStart = parseDateLabel(startDate);
    const rangeEnd = parseDateLabel(endDate);

    let totals = {};

    for (const label of labels) {
        totals[label] = 0; // initialize totals for each label
    }

    if (!rangeStart || !rangeEnd || rangeStart > rangeEnd) {
        return totals;
    }

    const rangeEndExclusive = getNextLocalMidnight(rangeEnd);

    for (const session of sessions) {

        const parsedStart = new Date(session.start_time);
        const parsedEnd = session.end_time ? new Date(session.end_time) : new Date();

        if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
            continue;
        }

        let currentStart = parsedStart > rangeStart ? parsedStart : new Date(rangeStart);
        const sessionEnd = parsedEnd < rangeEndExclusive ? parsedEnd : rangeEndExclusive;

        if (sessionEnd <= currentStart) {
            continue;
        }

        while (currentStart < sessionEnd) {
            const currentDateLabel = formatDateLabel(currentStart);
            const nextMidnight = getNextLocalMidnight(currentStart);

            const currentEnd = nextMidnight < sessionEnd ? nextMidnight : sessionEnd;
            const durationInMinutes = (currentEnd - currentStart) / (1000 * 60); // convert milliseconds to minutes

            if (totals[currentDateLabel] !== undefined) {
                totals[currentDateLabel] += durationInMinutes;
            }

            currentStart = currentEnd;
        }
    }
    return totals;
}
