import {
    addLocalDays,
    formatLocalDate,
    parseLocalDate
} from '../analyticsCalculator.js';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getMonday(date) {
    const monday = new Date(date);
    const daysSinceMonday = (monday.getDay() + 6) % 7;

    monday.setDate(monday.getDate() - daysSinceMonday);
    return monday;
}

function formatMonth(date) {
    return date.toLocaleDateString(undefined, { month: 'short' });
}

function getLayout(weekCount) {
    if (weekCount <= 5) {
        return 'compact';
    }

    if (weekCount <= 14) {
        return 'wide';
    }

    return 'scroll';
}

function createDayCell(date, rangeStart, rangeEnd, activityByDate) {
    const dateLabel = formatLocalDate(date);
    const outsideSelectedRange = date < rangeStart || date > rangeEnd;
    const activity = activityByDate.get(dateLabel);

    return {
        date: dateLabel,
        dayOfWeek: (date.getDay() + 6) % 7,
        minutes: activity?.minutes || 0,
        sessions: activity?.sessions || 0,
        active: activity?.active || false,
        outsideSelectedRange
    };
}

function getMonthLabel(days, weekIndex) {
    const visibleDays = days.filter(day => !day.outsideSelectedRange);
    const firstOfMonth = visibleDays.find(day => {
        const date = parseLocalDate(day.date);
        return date?.getDate() === 1;
    });
    const firstVisibleDay = visibleDays[0];

    if (!firstOfMonth && weekIndex !== 0) {
        return '';
    }

    return formatMonth(parseLocalDate(firstOfMonth?.date || firstVisibleDay?.date));
}

export function buildActivityCalendar(stats) {
    const rangeStart = parseLocalDate(stats.range.startDate);
    const rangeEnd = parseLocalDate(stats.range.endDate);

    if (!rangeStart || !rangeEnd) {
        throw new Error('Activity calendar requires a valid selected date range.');
    }

    const activityByDate = new Map(
        stats.dailyActivity.map(day => [day.date, day])
    );
    const weeks = [];
    let weekStart = getMonday(rangeStart);
    const finalWeekStart = getMonday(rangeEnd);

    while (weekStart <= finalWeekStart) {
        const days = Array.from({ length: 7 }, (_, offset) => (
            createDayCell(
                addLocalDays(weekStart, offset),
                rangeStart,
                rangeEnd,
                activityByDate
            )
        ));

        weeks.push({
            startDate: formatLocalDate(weekStart),
            days,
            monthLabel: getMonthLabel(days, weeks.length)
        });
        weekStart = addLocalDays(weekStart, 7);
    }

    return {
        weekdayLabels: WEEKDAY_LABELS,
        weeks,
        layout: getLayout(weeks.length),
        summary: {
            activeDays: stats.summary.activeDays,
            totalDays: stats.range.dayCount,
            activeDayRate: stats.summary.activeDayRate,
            longestWorkingStreak: stats.consistency.longestWorkingStreak,
            longestBreakStreak: stats.consistency.longestBreakStreak
        }
    };
}
